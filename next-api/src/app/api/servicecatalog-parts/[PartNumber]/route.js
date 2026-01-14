import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import redis, { deleteByPattern } from "../../../../../lib/redis";

// GET Part by PartNumber
export async function GET(request, { params }) {
    const { PartNumber } = await params
    const partNumber = decodeURIComponent(PartNumber)

    if (!partNumber) {
        return NextResponse.json(
            { success: false, message: "Invalid Part Number" },
            { status: 400 }
        );
    }

    const cacheKey = `servicecatalog-parts:detail:${partNumber}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    const part = await prisma.servicecatalog_parts.findUnique({
        where: { PartNumber: partNumber },
    });

    if (!part) {
        return NextResponse.json(
            { success: true, message: "Part not found", data: null },
            { status: 404 }
        );
    }

    const response = { success: true, message: "Part detail fetched", data: part };
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    return NextResponse.json(response, { status: 200 });
}

// UPDATE Part by PartNumber
export async function PATCH(request, { params }) {
    const partNumber = decodeURIComponent(params.PartNumber);

    const {
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
        // qty_parts,
        Tax,
        Total,
    } = await request.json();

    try {
        const updatedPart = await prisma.servicecatalog_parts.update({
            where: { PartNumber: partNumber },
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
                // qty_parts: parseInt(qty_parts),
                Tax: Tax ? Number(Tax) : null,
                Total: Total ? Number(Total) : null,
            },
        });

        await deleteByPattern("servicecatalog-parts:list:*");
        await redis.del(`servicecatalog-parts:detail:${partNumber}`);

        return NextResponse.json(
            {
                success: true,
                message: "Part updated successfully!",
                data: updatedPart,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating part:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update part",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE Part by PartNumber
export async function DELETE(request, { params }) {
    const partNumber = decodeURIComponent(params.PartNumber);

    try {
        await prisma.servicecatalog_parts.delete({
            where: { PartNumber: partNumber },
        });

        await deleteByPattern("servicecatalog-parts:list:*");
        await redis.del(`servicecatalog-parts:detail:${partNumber}`);

        return NextResponse.json(
            { success: true, message: "Part deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting part:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete part",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
