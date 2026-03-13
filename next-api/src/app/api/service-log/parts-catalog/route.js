/**
 * TODO LIST
 * Change the Part Catalog to Main Feature for MO
 * Now is being used for catalog Only.
 */
  /**
 * Parts Catalog API
 * GET  ?mode=paginated  — offset pagination (super-page cache friendly)
 * GET  ?mode=virtual    — offset window (infinite scroll)
 * GET  ?mode=safety     — offset window (infinite scroll)
 *
 * Both modes use skip/take directly so the client controls the exact window.
 */

import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

const parseBool = (val) => val === "true" || val === true;

// ── WHERE clause ─────────────────────────────────────────────────────────────

function buildWhere(searchParams) {
  const partNum  = searchParams.get("partNumber") ?? "";
  const keyword  = searchParams.get("keyword")    ?? "";
  const partDesc = searchParams.get("partDesc")   ?? "";
  const search   = searchParams.get("search")     ?? "";

  const AND = [];

  if (search) {
    AND.push({
      OR: [
        { PartNumber:      { contains: search } },
        { Keyword:         { contains: search } },
        { PartDescription: { contains: search } },
      ],
    });
  }
  if (partNum)  AND.push({ PartNumber:      { contains: partNum} });
  if (keyword)  AND.push({ Keyword:         { contains: keyword} });
  if (partDesc) AND.push({ PartDescription: { contains: partDesc} });

  return AND.length ? { AND } : {};
}

// ── ORDER BY ─────────────────────────────────────────────────────────────────

const ALLOWED_SORT = new Set(["PartNumber", "Keyword", "PartDescription", "Price", "Total"]);

function buildOrderBy(searchParams) {
  const raw     = searchParams.get("sortBy")  ?? "PartNumber";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const field   = ALLOWED_SORT.has(raw) ? raw : "PartNumber";
  return { [field]: sortDir };
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(request) {
  try {
    // const { searchParams } = new URL(request.url);
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const mode = searchParams.get("mode") ?? "";

    const where   = buildWhere(searchParams);
    const orderBy = buildOrderBy(searchParams);
    if (mode === "") {
      const data = await prisma.servicecatalog_parts.findMany({
        where,
        orderBy,
      });

      return NextResponse.json({
        success:   true,
        status:    200,
        message:   "List Data Parts Catalog (Fetch All)",
        data,
        total:     data.length, // Total is just the array length
        mode:      "all",
      });
    }

    // ──  Safety Mode (Hard Limit) ──────────────────────────────────────────
    if (mode === "safety") {
      const take = 5000; // Hard cap

      const [total, data] = await prisma.$transaction([
        prisma.servicecatalog_parts.count({ where }),
        prisma.servicecatalog_parts.findMany({ 
            where, 
            orderBy, 
            take: take 
        }),
      ]);

      return NextResponse.json({
        success:   true,
        status:    200,
        message:   "List Data Parts Catalog (Safety Limit 5000)",
        data,
        total,     // Real total in DB
        displayed: data.length, // How many we actually returned
        limit:     take,
      });
    }

    // ── paginated ──────────────────────────────────────────────────────────
    if (mode === "paginated") {
      // Client sends skip + take directly (no page × pageSize math on server)
      const skip = Math.max(0,    parseInt(searchParams.get("skip") ?? "0",    10));
      const take = Math.min(2000, Math.max(1, parseInt(searchParams.get("take") ?? "1000", 10)));

      const [total, data] = await prisma.$transaction([
        prisma.servicecatalog_parts.count({ where }),
        prisma.servicecatalog_parts.findMany({ where, orderBy, skip, take }),
      ]);

      return NextResponse.json({
        success:   true,
        status:    200,
        message:   "List Data Parts Catalog (paginated)",
        data,
        total,
        skip,
        take,
      });
    }

    // ── virtual / infinite-scroll ──────────────────────────────────────────
    if (mode === "virtual") {
      const skip = Math.max(0,   parseInt(searchParams.get("skip") ?? "0",   10));
      const take = Math.min(500, Math.max(1, parseInt(searchParams.get("take") ?? "100", 10)));

      const [total, data] = await prisma.$transaction([
        prisma.servicecatalog_parts.count({ where }),
        prisma.servicecatalog_parts.findMany({ where, orderBy, skip, take }),
      ]);

      return NextResponse.json({
        success: true,
        status:  200,
        message: "List Data Parts Catalog (virtual)",
        data,
        total,
        skip,
        take,
      });
    }

    return NextResponse.json({ success: false, message: `Unknown mode: ${mode}` }, { status: 400 });

  } catch (e) {
    console.error("🔥 ERROR in GET API:", e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data", error: e.message },
      { status: 500 },
    );
  }
}

// ── POST ──────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      PartNumber, Keyword, PartDescription, Orderability, RestrictionReason,
      CSR_Flag, ROHS_Flag, Returnable_Flag, HardRoll_Flag, DangerousGoods_Flag,
      LithiumBattery_Flag, Oversize_Flag, Heavy_Flag,
      Price, FreightPrice, Shipping_Fee, Tax, Total,
    } = body;

    if (!PartNumber || !Keyword || !PartDescription) {
      return NextResponse.json(
        { success: false, message: "PartNumber, Keyword, and PartDescription are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.servicecatalog_parts.findUnique({ where: { PartNumber } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "PartNumber already exists" },
        { status: 409 },
      );
    }

    const newPart = await prisma.servicecatalog_parts.create({
      data: {
        PartNumber, Keyword, PartDescription,
        Orderability:        parseBool(Orderability),
        RestrictionReason,
        CSR_Flag:            parseBool(CSR_Flag),
        ROHS_Flag:           parseBool(ROHS_Flag),
        Returnable_Flag:     parseBool(Returnable_Flag),
        HardRoll_Flag:       parseBool(HardRoll_Flag),
        DangerousGoods_Flag: parseBool(DangerousGoods_Flag),
        LithiumBattery_Flag: parseBool(LithiumBattery_Flag),
        Oversize_Flag:       parseBool(Oversize_Flag),
        Heavy_Flag:          parseBool(Heavy_Flag),
        Price:        isNaN(Number(Price))        ? 0 : Number(Price),
        FreightPrice: isNaN(Number(FreightPrice)) ? 0 : Number(FreightPrice),
        Shipping_Fee: isNaN(Number(Shipping_Fee)) ? 0 : Number(Shipping_Fee),
        Tax:          isNaN(Number(Tax))          ? 0 : Number(Tax),
        Total:        isNaN(Number(Total))        ? 0 : Number(Total),
      },
    });

    return NextResponse.json(
      { success: true, message: "Part created successfully", data: newPart },
      { status: 201 },
    );
  } catch (e) {
    console.error("🔥 ERROR in POST API:", e);
    return NextResponse.json(
      { success: false, message: "Failed to create part", error: e.message },
      { status: 500 },
    );
  }
}
