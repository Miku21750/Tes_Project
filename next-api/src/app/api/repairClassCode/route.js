import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// GET: Ambil data Repair Class Code
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        let whereCondition = {};

        if (search) {
            whereCondition.OR = [
                { Code: { contains: search } },
                { Description: { contains: search } },
                { Definition: { contains: search } }
            ];
        }

        const totalCount = await prisma.repairClassCode.count({ where: whereCondition });

        const repairClassCodes = await prisma.repairClassCode.findMany({
            where: whereCondition,
            // skip: skip,
            // take: limit,
            orderBy: { Code: "asc" },
        });

        return NextResponse.json({
            success: true,
            message: "List Data Repair Class Code",
            data: repairClassCodes,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        }, {
            status: 200,
            // headers: {
            //     "Access-Control-Allow-Origin": "*",
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

// POST: Buat data baru Repair Class Code
export async function POST(request) {
    try {
        const {
            Code,
            Description,
            Definition,
            PaymentEligibility,
            CreatedOn, // opsional
        } = await request.json();

        const newRepairClassCode = await prisma.repairClassCode.create({
            data: {
                Code,
                Description,
                Definition,
                PaymentEligibility,
                CreatedOn: CreatedOn ? new Date(CreatedOn) : undefined
            }
        });

        return NextResponse.json({
            success: true,
            message: "Repair Class Code created successfully!",
            data: newRepairClassCode,
        }, { status: 201 });
    } catch (error) {
        console.error("🔥 ERROR in POST API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to create Repair Class Code",
            error: error.message
        }, { status: 500 });
    }
}
