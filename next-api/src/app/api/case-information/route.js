import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { generateID } from "@/utils/generateID";
import { notifySocket } from "../../../../lib/SocketClient";
import redis, { deleteByPattern, redisKey } from "../../../../lib/redis";

// ─── helpers ────────────────────────────────────────────────────────────────

function buildWhere(searchParams) {
  const CaseStatus         = searchParams.get("CaseStatus");
  const AssetID            = searchParams.get("AssetID");
  const excludeStatusesRaw = searchParams.getAll("excludeStatuses[]");
  const resourceTarget     = searchParams.get("resource");
  const startDate          = searchParams.get("startDate");
  const endDate            = searchParams.get("endDate");

  // ── Global search (from toolbar search input) ──────────────────────────────
  // Searches across the most useful text fields. Keep this index-friendly:
  // contains on short prefix-indexed fields is fine; avoid OR on large text blobs.
  const search = searchParams.get("search")?.trim() ?? "";

  const AND = [];

  if (search) {
    AND.push({
      OR: [
        { CaseID:      { contains: search } },
        { CaseSubject: { contains: search } },
        // nested relation search
        { asset_information: { SerialNumber:  { contains: search } } },
        { asset_information: { ProductNumber: { contains: search } } },
        { asset_information: { product_information: { ProductName: { contains: search } } } },
        { contact_information: { site_account: { Company: { contains: search } } } },
        { createdByUser: { Name: { contains: search } } },
        { ownerUser:     { Name: { contains: search } } },
      ],
    });
  }

  // ── Column / facet filters ────────────────────────────────────────────────
  if (CaseStatus) {
    AND.push({ CaseStatus });
  } else if (excludeStatusesRaw?.length) {
    AND.push({ CaseStatus: { notIn: excludeStatusesRaw } });
  }

  if (AssetID) AND.push({ AssetID: parseInt(AssetID) });

  if (startDate || endDate) {
    const createdOn = {};
    if (startDate) createdOn.gte = new Date(startDate);
    if (endDate)   createdOn.lte = new Date(endDate + "T23:59:59");
    AND.push({ CreatedOn: createdOn });
  }

  if (resourceTarget) {
    AND.push({
      OR: [
        { createdByUser: { ResourceId: resourceTarget } },
        { ownerUser:     { ResourceId: resourceTarget } },
      ],
    });
  }

  // ── Extra column filters from faceted/column-header filters ───────────────
  // The client sends these as individual query params when filtersToParams maps them.
  const serialNumber  = searchParams.get("SerialNumber")?.trim();
  const productNumber = searchParams.get("ProductNumber")?.trim();
  const productName   = searchParams.get("ProductName")?.trim();
  const createdName   = searchParams.get("CreatedName")?.trim();
  const owner         = searchParams.get("Owner")?.trim();
  const caseSubject   = searchParams.get("CaseSubject")?.trim();

  if (serialNumber)  AND.push({ asset_information: { SerialNumber:  { contains: serialNumber } } });
  if (productNumber) AND.push({ asset_information: { ProductNumber: { contains: productNumber } } });
  if (productName)   AND.push({ asset_information: { product_information: { ProductName: { contains: productName } } } });
  if (createdName)   AND.push({ createdByUser: { Name: { contains: createdName } } });
  if (owner)         AND.push({ ownerUser:     { Name: { contains: owner } } });
  if (caseSubject)   AND.push({ CaseSubject:   { contains: caseSubject } });

  return AND.length ? { AND } : {};
}

// ── ORDER BY ─────────────────────────────────────────────────────────────────
// Accepts sortBy/sortDir query params — falls back to CreatedOn desc.
// Only allow fields that exist directly on caseinformation to avoid Prisma errors.

const ALLOWED_SORT_FIELDS = new Set([
  "CaseID",
  "CaseSubject",
  "CaseStatus",
  "CreatedOn",
]);

function buildOrderBy(searchParams) {
  const raw     = searchParams.get("sortBy")  ?? "CreatedOn";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const field   = ALLOWED_SORT_FIELDS.has(raw) ? raw : "CreatedOn";
  return { [field]: sortDir };
}

// ── Lean select ───────────────────────────────────────────────────────────────

const CASE_LIST_SELECT = {
  CaseID:      true,
  CaseSubject: true,
  CaseStatus:  true,
  CreatedOn:   true,
  AssetID:     true,
  ContactID:   true,

  createdByUser: { select: { IDUser: true, Name: true, ResourceId: true } },
  ownerUser:     { select: { IDUser: true, Name: true } },

  otcCodeTable: { select: { OTCCode: true, Description: true } },
  ErfDoc:             true,
  CaseID_Manual:      true,
  CaseID_Manual_Date: true,
  CaseType:           true,

  asset_information: {
    select: {
      AssetID:       true,
      SerialNumber:  true,
      ProductNumber: true,
      WarrantyOTCCode: { select: { OTCCode: true, Description: true } },
      product_information: {
        select: {
          ProductName:   true,
          ProductNumber: true,
          product_type:  { select: { ProductType: true, ProductTower: true } },
        },
      },
    },
  },

  contact_information: {
    select: {
      ContactID:  true,
      FirstName:  true,
      LastName:   true,
      site_account: { select: { SiteAccountID: true, Company: true } },
    },
  },


  ActionLog: {
    select: {
      ChangeAt:       true,
      dataOld:        true,
      dataNew:        true,
      logDescription: true,
      model:          true,
      changedBy:      true,
    },
    orderBy: { ChangeAt: "desc" },
    take: 20,
  },
};

function formatCaseRow(caseData) {
  return {
    CaseID:          caseData.CaseID,
    CreatedOn:       caseData.CreatedOn?.toLocaleString() ?? null,
    UpdateOn:        caseData.ActionLog?.[0]?.ChangeAt ?? null,
    CaseSubject:     caseData.CaseSubject,
    CustomerAccount: caseData.contact_information?.site_account?.Company ?? "No Company",
    Primary:         `${caseData.contact_information?.FirstName ?? ""} ${caseData.contact_information?.LastName ?? ""}`.trim(),
    SerialNumber:    caseData.asset_information?.SerialNumber   ?? "No Serial",
    ProductNumber:   caseData.asset_information?.ProductNumber  ?? "No Product Number",
    ProductName:     caseData.asset_information?.product_information?.ProductName ?? "No Product Name",
    CreatedName:     caseData.createdByUser?.Name,
    Owner:           caseData.ownerUser?.Name,
    WorkGroup:       caseData.ownerUser?.Name,
    CaseStatus:      caseData.CaseStatus,
    // Nested object for columns that deep-access caseinformation.*
    caseinformation: {
      ...caseData,
      ActionLog: undefined,
    },
    UpdatedActionLogs: (caseData.ActionLog ?? [])
      .filter((log) => log.dataOld !== log.dataNew && log.model !== "CaseOwner")
      .map(({ ChangeAt, changedBy, dataOld, dataNew, logDescription, model }) => ({
        ChangeAt, ChangedBy: changedBy, dataOld, dataNew, logDescription, model,
      })),
  };
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // ── Date range guard (max 1 year) ─────────────────────────────────────────
  const startDate = searchParams.get("startDate");
  const endDate   = searchParams.get("endDate");
  if (startDate && endDate) {
    const diff = new Date(endDate) - new Date(startDate);
    if (diff > 365 * 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { success: false, message: "Date range maksimal adalah satu tahun" },
        { status: 400 },
      );
    }
  }

  const mode = searchParams.get("mode") ?? "all";

  // ── Redis cache ───────────────────────────────────────────────────────────
  const cacheKey = redisKey(`case:list:${searchParams.toString() || "all"}`);
  const cached   = await redis.get(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached), { status: 200 });

  const where   = buildWhere(searchParams);
  const orderBy = buildOrderBy(searchParams); // ← now used in ALL modes

  // ── Status counts (always, in parallel) ──────────────────────────────────
  const [openCount, closedCount, inActiveCount] = await Promise.all([
    prisma.caseinformation.count({ where: { CaseStatus: "Open" } }),
    prisma.caseinformation.count({ where: { CaseStatus: "Close" } }),
    prisma.caseinformation.count({ where: { CaseStatus: "InActive" } }),
  ]);

  let cases, total, skip, take;

  // ── mode: all ─────────────────────────────────────────────────────────────
  if (mode === "all") {
    cases = await prisma.caseinformation.findMany({
      where:   Object.keys(where).length ? where : undefined,
      select:  CASE_LIST_SELECT,
      orderBy,
    });
    total = cases.length;
  }

/**
 * ADD THIS BLOCK inside your existing GET handler in /api/case-information/route.js
 * Place it right after the date range guard, before the Redis cache check.
 *
 * This adds mode=distinct to the SAME existing route — no new file needed.
 * It returns distinct values for a given field, filtered by a search query.
 * Used by DataTableFacetedFilter's fetchOptions prop for dynamic autocomplete.
 *
 * Request:  GET /api/case-information?mode=distinct&field=SerialNumber&q=HP
 * Response: { success: true, values: ["HP123", "HP456", ...] }
 */

// ── Paste this BEFORE the Redis cache block in your existing GET handler ──────

  else if (mode === "distinct") {
  const field  = searchParams.get("field") ?? "";
  const q      = (searchParams.get("q") ?? "").trim();
  const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "30", 10)));

  // Cache distinct queries too — 5 min TTL, they change rarely
  const distKey = redisKey(`case:distinct:${field}:${q}:${limit}`);
  const distCached = await redis.get(distKey);
  if (distCached) return NextResponse.json(JSON.parse(distCached), { status: 200 });

  // Map of allowed field → Prisma query shape
  // Only fields that exist directly on caseinformation or via a join
  const DISTINCT_FIELDS = {
    SerialNumber:  () => prisma.asset_information.findMany({
      where: q ? { SerialNumber: { contains: q } } : {},
      select: { SerialNumber: true },
      distinct: ["SerialNumber"],
      orderBy: { SerialNumber: "asc" },
      take: limit,
    }).then(r => r.map(x => x.SerialNumber).filter(Boolean)),

    ProductNumber: () => prisma.asset_information.findMany({
      where: q ? { ProductNumber: { contains: q } } : {},
      select: { ProductNumber: true },
      distinct: ["ProductNumber"],
      orderBy: { ProductNumber: "asc" },
      take: limit,
    }).then(r => r.map(x => x.ProductNumber).filter(Boolean)),

    ProductName: () => prisma.product_information.findMany({
      where: q ? { ProductName: { contains: q } } : {},
      select: { ProductName: true },
      distinct: ["ProductName"],
      orderBy: { ProductName: "asc" },
      take: limit,
    }).then(r => r.map(x => x.ProductName).filter(Boolean)),

    // Owner and CreatedName both query the users table
    Owner: () => prisma.User.findMany({
      where: q ? { Name: { contains: q } } : {},
      select: { Name: true },
      distinct: ["Name"],
      orderBy: { Name: "asc" },
      take: limit,
    }).then(r => r.map(x => x.Name).filter(Boolean)),

    CreatedName: () => prisma.User.findMany({
      where: q ? { Name: { contains: q } } : {},
      select: { Name: true },
      distinct: ["Name"],
      orderBy: { Name: "asc" },
      take: limit,
    }).then(r => r.map(x => x.Name).filter(Boolean)),
  };

  if (!DISTINCT_FIELDS[field]) {
    return NextResponse.json(
      { success: false, message: `Unknown field: ${field}` },
      { status: 400 },
    );
  }

  try {
    const values = await DISTINCT_FIELDS[field]();
    const result = { success: true, values };
    await redis.set(distKey, JSON.stringify(result), "EX", 300);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Distinct query failed", error: e.message },
      { status: 500 },
    );
  }
}

// ── END of distinct block — your existing cache + mode checks continue below ──

  // ── mode: paginated ───────────────────────────────────────────────────────
  else if (mode === "paginated") {
    skip = Math.max(0,   parseInt(searchParams.get("skip") ?? "0",  10));
    take = Math.min(200, Math.max(1, parseInt(searchParams.get("take") ?? "50", 10)));

    [total, cases] = await Promise.all([
      prisma.caseinformation.count({ where: Object.keys(where).length ? where : undefined }),
      prisma.caseinformation.findMany({
        where:   Object.keys(where).length ? where : undefined,
        select:  CASE_LIST_SELECT,
        orderBy,   // ← was hardcoded { CreatedOn: "desc" }, now uses sortBy/sortDir
        skip,
        take,
      }),
    ]);
  }

  // ── mode: virtual ─────────────────────────────────────────────────────────
  else if (mode === "virtual") {
    skip = Math.max(0,   parseInt(searchParams.get("skip") ?? "0",  10));
    take = Math.min(100, Math.max(1, parseInt(searchParams.get("take") ?? "50", 10)));

    [total, cases] = await Promise.all([
      prisma.caseinformation.count({ where: Object.keys(where).length ? where : undefined }),
      prisma.caseinformation.findMany({
        where:   Object.keys(where).length ? where : undefined,
        select:  CASE_LIST_SELECT,
        orderBy,
        skip,
        take,
      }),
    ]);
  }

  else {
    return NextResponse.json(
      { success: false, message: `Unknown mode: ${mode}` },
      { status: 400 },
    );
  }

  const response = {
    success: true,
    message: "List Data Case",
    data:    cases.map(formatCaseRow),
    total,
    ...(skip !== undefined && { skip, take }),
    mode,
    value: { open: openCount, closed: closedCount, inActive: inActiveCount },
  };

  await redis.set(cacheKey, JSON.stringify(response), "EX", 120);
  return NextResponse.json(response, { status: 200 });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request) {
  const {
    SiteAccountID, ContactID, AssetID, CaseSubject, CaseType, KCI_Flag,
    IncomingChannel, CaseStatus, CasePriority, CustomerSeverity, CaseClosedDate,
    CaseNote, SymptomCode, CaseResolution, CreatedBy, ProblemDescription,
    CaseNoteProduct, accessories,
  } = await request.json();

  try {
    if (!AssetID && !ContactID) {
      return NextResponse.json(
        { success: false, message: "Asset/Contact selection is required to create a case." },
        { status: 400 },
      );
    }

    const CaseID = await generateID("C-", "caseinformation", "CaseID");

    const case_information = await prisma.caseinformation.create({
      data: {
        CaseID,
        SiteAccountID, ContactID, AssetID, CaseSubject, CaseType, KCI_Flag,
        IncomingChannel, CaseStatus, CasePriority, CustomerSeverity, CaseClosedDate,
        CaseNote, SymptomCode, CaseResolution,
        Owner:     parseInt(CreatedBy),
        CreatedBy: parseInt(CreatedBy),
        ProblemDescription,
        CaseProductNote: CaseNoteProduct,
        ...(Array.isArray(accessories) && accessories.length > 0 && {
          accessory: {
            create: accessories.map((acc) => ({
              Accessories: acc.name,
              Note:        acc.note,
              CT_SNCode:   acc.code,
            })),
          },
        }),
      },
    });

    await Promise.all([
      deleteByPattern("case:list:*"),
      deleteByPattern("case:detail:*"),
    ]);

    await notifySocket(
      "case:created",
      { message: `Case ${case_information.CaseID} created`, caseId: case_information.CaseID },
      { createdById: case_information.CreatedBy, ownerId: case_information.Owner },
    );

    return NextResponse.json(
      { success: true, message: "Case Created Successfully!", data: case_information },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create case", error: error.message },
      { status: 500 },
    );
  }
}
