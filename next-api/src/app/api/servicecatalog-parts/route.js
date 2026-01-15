import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import redis, { deleteByPattern, redisKey } from "../../../../lib/redis";

export async function GET(request) {
  try {
    //ambil parameter
    const { searchParams } = new URL(request.url);
    // const tower = searchParams.get("ProductTower") || "";
    // const group = searchParams.get("ProductGroup") || "";

    
    const whereCondition = {};
    // if (tower) whereCondition.ProductTower = { equals: tower };
    // if (group) whereCondition.ProductGroup = { equals: group };

    const cacheKey = redisKey(`servicecatalog-parts:list:${searchParams.toString() || "all"}`);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const servicecatalog_part = await prisma.servicecatalog_parts.findMany({
        where: whereCondition,
        orderBy: { PartNumber: "asc" },
      });

    const response = {
      success: true,
      message: "List Data Product Type",
      data: servicecatalog_part
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("🔥 ERROR in GET API:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch data",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();

  const {
    PartNumber,
    Keyword,
    PartDescription,
    Orderability,
    RestrictionReason,
    CSR_Flag,
    ROHS_Flag,
    Returnable_Flag,
    HardRoll_Flag,
    DangerousGoods_Flag,
    LithiumBattery_Flag,
    Oversize_Flag,
    Heavy_Flag,
    Price,
    FreightPrice,
    Shipping_Fee,
    qty_parts,
    Tax,
    Total,
  } = body;

  // Cek apakah PartNumber sudah ada (karena itu adalah @id di Prisma)
  const existingPart = await prisma.servicecatalog_parts.findUnique({
    where: { PartNumber },
  });

  if (existingPart) {
    return NextResponse.json(
      {
        success: false,
        message: "Part Number already exists.",
      },
      { status: 409 }
    );
  }

  // Simpan ke database
  try {
    const newPart = await prisma.servicecatalog_parts.create({
      data: {
        PartNumber,
        Keyword,
        PartDescription,
        Orderability,
        RestrictionReason,
        CSR_Flag,
        ROHS_Flag,
        Returnable_Flag,
        HardRoll_Flag,
        DangerousGoods_Flag,
        LithiumBattery_Flag,
        Oversize_Flag,
        Heavy_Flag,
        Price: Price ? Number(Price) : null,
        FreightPrice: FreightPrice ? Number(FreightPrice) : null,
        Shipping_Fee: Shipping_Fee ? parseFloat(Shipping_Fee) : 0,
        qty_parts: parseInt(qty_parts),
        Tax: Tax ? Number(Tax) : null,
        Total: Total ? Number(Total) : null,
      },
    });

    await deleteByPattern("servicecatalog-parts:list:*");

    return NextResponse.json(
      {
        success: true,
        message: "Service Catalog Part created successfully!",
        data: newPart,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving part:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      PartNumber,
      Keyword,
      PartDescription,
      Orderability,
      RestrictionReason,
      CSR_Flag,
      ROHS_Flag,
      Returnable_Flag,
      HardRoll_Flag,
      DangerousGoods_Flag,
      LithiumBattery_Flag,
      Oversize_Flag,
      Heavy_Flag,
      Price,
      FreightPrice,
      Shipping_Fee,
      qty_parts,
      Tax,
      Total,
    } = body;

    // Pastikan PartNumber ada
    const existingPart = await prisma.servicecatalog_parts.findUnique({
      where: { PartNumber },
    });

    if (!existingPart) {
      return NextResponse.json(
        {
          success: false,
          message: "Part Number not found.",
        },
        { status: 404 }
      );
    }

    const updatedPart = await prisma.servicecatalog_parts.update({
      where: { PartNumber },
      data: {
        Keyword,
        PartDescription,
        Orderability,
        RestrictionReason,
        CSR_Flag,
        ROHS_Flag,
        Returnable_Flag,
        HardRoll_Flag,
        DangerousGoods_Flag,
        LithiumBattery_Flag,
        Oversize_Flag,
        Heavy_Flag,
        Price: Price ? Number(Price) : null,
        FreightPrice: FreightPrice ? Number(FreightPrice) : null,
        Shipping_Fee: Shipping_Fee ? parseFloat(Shipping_Fee) : 0,
        qty_parts: parseInt(qty_parts),
        Tax: Tax ? Number(Tax) : null,
        Total: Total ? Number(Total) : null,
      },
    });

    await deleteByPattern("servicecatalog-parts:list:*");
    await redis.del(`servicecatalog-parts:detail:${PartNumber}`);

    return NextResponse.json(
      {
        success: true,
        message: "Service Catalog Part updated successfully!",
        data: updatedPart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating part:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update part.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
