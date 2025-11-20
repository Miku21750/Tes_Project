import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// GET: Fetch list of Bookings with optional search and pagination
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 100;
        const skip = (page - 1) * limit;

        let whereCondition = {};

        if (search) {
            whereCondition = {
                OR: [
                    { BookingId: { equals: parseInt(search) || -1 } },
                    { WOID: { contains: search } },
                    { BookingStatus:{ Description: { contains: search } } },
                ],
            };
        }

        const totalCount = await prisma.bookings.count({
            where: whereCondition,
        });

        const bookings = await prisma.bookings.findMany({
            where: whereCondition,
            skip: skip,
            take: limit,
            orderBy: { BookingId: "asc" },
            include: {
                workorder: true,
                createdByUser: true,
                bookingDetails: true,
                BookingStatus: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "List Data Bookings",
            data: bookings,
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
        console.error("🔥 ERROR in GET Bookings API:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        }, { status: 500 });
    }
}

// POST: Create a new Booking
export async function POST(request) {
    try {
        const {
            BookingStatusId,
            WOID,
            ScheduleJeopardy,
            ScheduleJeopardyTime,
            DoNotDisturb,
            CeScheduleChange,
            CreatedBy,
            TotalBillableDurationInMinutes,
            TotalInProgressDurationInMinutes,
            TotalBreakDurationInMinutes
        } = await request.json();

        const booking = await prisma.bookings.create({
            data: {
                BookingStatusId,
                WOID,
                ScheduleJeopardy,
                ScheduleJeopardyTime: ScheduleJeopardyTime ? new Date(ScheduleJeopardyTime) : undefined,
                DoNotDisturb,
                CeScheduleChange,
                CreatedBy,
                TotalBillableDurationInMinutes,
                TotalInProgressDurationInMinutes,
                TotalBreakDurationInMinutes
            },
            include: {
                BookingStatus: true,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Booking Created Successfully!",
            data: booking,
        }, { status: 201 });

    } catch (error) {
        console.error("🔥 ERROR in POST Bookings API:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create booking",
            error: error.message,
        }, { status: 500 });
    }
}
