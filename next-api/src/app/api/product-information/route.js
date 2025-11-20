import { NextResponse } from "next/server";

import prisma  from "../../../../prisma/client";

export async function GET(request) {
    try{
        // Ambil parameter pencarian & pagination
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        console.log("Query Params:", { search, page, limit });
        
        //  Check if table exists
        // console.log("Prisma Model Names:", Object.keys(prisma)); // Debug log

        // Hitung jumlah data total
        const totalCount = await prisma.product_information.count({
            where: search
                ? {
                    OR: [
                        { ProductNumber: { contains: search } },
                        { ProductName: { contains: `%${search}%` } }
                    ]
                }
                : undefined, // Jika search kosong, tidak pakai filter
        });

        console.log("Total Data:", totalCount);

        // Hitung offset berdasarkan halaman
        const skip = (page - 1) * limit;

        // Ambil data dengan filter & pagination
        const product_information = await prisma.product_information.findMany({
            where: search
                ? {
                    OR: [
                        { ProductNumber: { contains: search } },
                        { ProductName: { contains: search } },
                        { HWPC: { contains: search } },
                    ]
                }
                : undefined,
            skip: skip,
            take: limit,
            orderBy: { ProductName: "asc" },
            include: { product_type: true }
        });

        return NextResponse.json({
            success: true,
            message: "List Data Product ",
            data: product_information,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        },
    {
        status: 200,
        // headers: {
        //     "Access-Control-Allow-Origin": "*", // Allow all origins
        //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        //     "Access-Control-Allow-Headers": "Content-Type, Authorization",
        // },
    });
    } catch (error) {
        console.error("🔥 ERROR in GET API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: error.message
        }, { status: 500 });
    }
}


/**
 * TODO 
 * MAKE CREATE ASSET AND CREATE PRODUCT SEPARATELY
 */



export async function POST(request) {
    const { ProductNumber, ProductName, ProductLine, ProductTypeID, HWPC } = await request.json();

    try {
        const missingFields = [];

        if (!ProductNumber || ProductNumber.trim() === "") missingFields.push("ProductNumber");
        if (!ProductName || ProductName.trim() === "") missingFields.push("ProductName");
        if (!ProductLine || ProductLine.trim() === "") missingFields.push("ProductLine");
        if (!HWPC || HWPC.trim() === "") missingFields.push("HWPC"); // typo: HPWC -> HWPC
        if (!ProductTypeID || isNaN(Number(ProductTypeID))) missingFields.push("Product Tower / Product Group / Product Type");

        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`
            }, { status: 400 });
        }

        
        const existingProduct = await prisma.product_information.findUnique({
            where: { ProductNumber }
        });

        if (existingProduct) {
            return NextResponse.json({
                success: false,
                message: `Product with ProductNumber ${ProductNumber} already exists.`,
            }, { status: 409 });
        }


        const product_information = await prisma.product_information.create({
            data: {
                ProductNumber,
                ProductName,
                ProductLine,
                ProductTypeID,
                HWPC,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Product Information Created Successfully!",
            data: product_information,
        }, { status: 201 });
    } catch (error) {
        if (error?.code === 'P2002') {
            return NextResponse.json({
                success: false,
                message: `Product with ProductNumber ${ProductNumber} already exists.`,
            }, { status: 409 });
        }
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
