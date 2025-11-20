import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
  try {
    //ambil parameter
    const { searchParams } = new URL(request.url);
    const Service_Description = searchParams.get("Service_description") || "";
    const CTat_RTime = searchParams.get("CTat_RTime") || "";

    
    const whereCondition = {};
    if (Service_Description) whereCondition.Service_Description = { equals: Service_Description };
    if (CTat_RTime) whereCondition.CTat_RTime = { equals: CTat_RTime };

    const warranty_service = await prisma.warranty_services.findMany({
        where: whereCondition,
        orderBy: { Service_offerID: "asc" },
      });


    return NextResponse.json(
      {
        success: true,
        message: "List Data Warranty Service",
        data: warranty_service
      },
      {
        status: 200,
        // headers: {
        //   "Access-Control-Allow-Origin": "*", // Allow all origins
        //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        //   "Access-Control-Allow-Headers": "Content-Type, Authorization",
        // },
      }
    );
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
  const { 
    Service_offerID,
    Service_description,	
    CTat_RTime,
    Price,
    Shipping_Fee,
    qty_ws,
    Tax,
    Total,
    WarrantyCondition,   // ✅ Tambah
    CaseTypeServices     // ✅ Tambah
  } = await request.json();

  const existingWarrantyService = await prisma.warranty_services.findFirst({
    where: { 
      Service_offerID : Service_offerID,
      Service_description : Service_description,	
      CTat_RTime : CTat_RTime,
      Price : parseFloat(Price),
      Shipping_Fee : parseFloat(Shipping_Fee),
      qty_ws : parseInt(qty_ws),
      Tax : parseFloat(Tax),
      Total : parseFloat(Total),
      WarrantyCondition : WarrantyCondition,   // ✅ Tambah
      CaseTypeServices : CaseTypeServices     // ✅ Tambah
    }
  });

  if (existingWarrantyService) {
    return NextResponse.json({
      success: true,
      message: "Warranty Services already exists. No need to create a new entry.",
      data: existingWarrantyService
    }, { status: 200 });
  }

  const warranty_service = await prisma.warranty_services.create({
    data:{
      Service_offerID : Service_offerID,
      Service_description : Service_description,	
      CTat_RTime : CTat_RTime,
      Price : parseFloat(Price),
      Shipping_Fee : parseFloat(Shipping_Fee),
      qty_ws : parseInt(qty_ws),
      Tax : parseFloat(Tax),
      Total : parseFloat(Total),
      WarrantyCondition : WarrantyCondition,   // ✅ Tambah
      CaseTypeServices : CaseTypeServices     // ✅ Tambah
    },
  });

  return NextResponse.json({
    success: true,  
    message: "Warranty Service Information Created Successfully!",
    data: warranty_service
  }, { status: 201 });
}
