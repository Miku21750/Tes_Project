import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// GET: Fetch ResourceAccounts with optional search & pagination
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
        { ResourceAccountId: { contains: search } },
        { Name: { contains: search } },
      ];
    }

    const totalCount = await prisma.resourceAccount.count({
      where: whereCondition,
    });

    const data = await prisma.resourceAccount.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: { Name: "asc" },
      include: {
        resource: true, // include relation to Resource table
        subkTechnicians: true,
        bookingDetails: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "List of Resource Accounts",
        data: data,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
      {
        status: 200,
        // headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        //   "Access-Control-Allow-Headers": "Content-Type, Authorization",
        // },
      }
    );
  } catch (error) {
    console.error("🔥 ERROR in GET ResourceAccount:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch resource accounts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new ResourceAccount
export async function POST(request) {
  try {
    const {
      ResourceAccountId,
      Name,
      ResourceId, // optional
    } = await request.json();

    const resourceAccount = await prisma.resourceAccount.create({
      data: {
        ResourceAccountId,
        Name,
        ResourceId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resource Account Created Successfully!",
        data: resourceAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 ERROR in POST ResourceAccount:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create resource account",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
