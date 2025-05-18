import { NextResponse } from "next/server";

import prisma from "../../../../prisma/client";


export async function GET(request) {
  try {
    // Ambil parameter pencarian & pagination dari URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('keyword') || '';  // Ambil kata kunci pencarian
    const page = parseInt(searchParams.get('page')) || 1;  // Halaman saat ini
    const limit = parseInt(searchParams.get('limit')) || 10;  // Batas data per halaman

    const woid = searchParams.get('WOID') || '';

    console.log('Query Params:', { search, page, limit });

    const whereCondition = {
      WOID: woid || undefined, // filter by WOID if given
      ...(search && {
        workorder: {
          WorkOrderNumber: { contains: search }, // or any searchable field in workorder
        },
      }),
    };
    

    // Hitung jumlah total data yang cocok dengan pencarian
    const totalCount = await prisma.bookings.count({
      where: whereCondition,
    });
    
    
    // Hitung offset berdasarkan halaman
    const skip = (page - 1) * limit;
    
    const bookings = await prisma.bookings.findMany({
      where: whereCondition,
      include: {
        workorder: true,
        createdByUser: true,
        bookingDetails: {
          include: {
            resource: true,
            resourceaccount: true,
            subkTechnician: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        CreatedAt: "desc",
      },
    });


    return NextResponse.json({
      success: true,
      message: 'List Data Subk Technician',
      data: bookings,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('🔥 ERROR in GET API:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch data',
        error: error.message
      },
      { status: 500 }
    );
  }
}
// /api/bookings
export async function POST(request) {
  try {
    const { WOID, CreatedBy } = await request.json();

    const woid = WOID;
    const createdBy = parseInt(CreatedBy);

    if (!woid || !createdBy) {
      return NextResponse.json(
        { error: 'WOID dan CreatedBy wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat booking
      const booking = await tx.bookings.create({
        data: {
          WOID: woid,
          BookingStatus: 'Schedule',
          CreatedBy: createdBy,
        },
      });

      // 2. Buat detail booking
      const bookingDetail = await tx.bookingDetails.create({
        data: {
          BookingId: booking.BookingId,
          ChangedBy: createdBy,
          Name: "",
          Status: "Schedule",
          StartTimeCustomerTime: null,
          EndTimeCustomerTime: null,
          EstimatedArrivalTimeCustomerTime: null,
          ActualArrivalTimeCustomerTime: null,
          StartTimeUserTime: null,
          EndTimeUserTime: null,
          DurationInMinutesUserTime: 0,
          EstimatedArrivalTimeUserTime: null,
          ActualArrivalTimeUserTime: null,
          ResourceId: null,
          ResourceAccountId: null,
          SubkTechnicianId: null,
        },
      });

      // 3. Update SystemStatus pada workorder
      await tx.workorder.update({
        where: { WOID: woid },
        data: {
            SystemStatus: "OPEN_SCHEDULED"
        }
      })


      return { BookingId: booking.BookingId };
    });

    return NextResponse.json(
      { message: 'Booking dan BookingDetails berhasil dibuat', ...result },
      { status: 201 }
    );

  } catch (error) {
    console.error('[BOOKING_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat booking.' },
      { status: 500 }
    );
  }
}
