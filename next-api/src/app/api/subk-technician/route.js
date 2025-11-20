import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// GET: Fetch list of SubkTechnician with optional search and pagination
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        const skip = (page - 1) * limit;

        let whereCondition = {};

        if (search) {
            whereCondition = {
                OR: [
                    { SubkTechnicianId: { contains: search } },
                    { Name: { contains: search } },
                ]
            };
        }

        const totalCount = await prisma.subkTechnician.count({
            where: whereCondition,
        });

        const subkTechnicians = await prisma.subkTechnician.findMany({
            where: whereCondition,
            // skip: skip,
            // take: limit,
            orderBy: { Name: "asc" },
            include: {
                bookingDetails: true,
                resourceAccount: true, // include relation to ResourceAccount
            },
        });

        return NextResponse.json({
            success: true,
            message: "List Data SubkTechnician",
            data: subkTechnicians,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
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
            error: error.message,
        }, { status: 500 });
    }
}

// POST: Create a new SubkTechnician
export async function POST(request) {
    try {
        const {
            SubkTechnicianId,
            Name,
            ResourceAccountId
        } = await request.json();

        const subkTechnician = await prisma.subkTechnician.create({
            data: {
                SubkTechnicianId,
                Name,
                ResourceAccountId,
            },
        });

        return NextResponse.json({
            success: true,
            message: "SubkTechnician Created Successfully!",
            data: subkTechnician,
        }, { status: 201 });

    } catch (error) {
        console.error("🔥 ERROR in POST API:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create SubkTechnician",
            error: error.message,
        }, { status: 500 });
    }
}
