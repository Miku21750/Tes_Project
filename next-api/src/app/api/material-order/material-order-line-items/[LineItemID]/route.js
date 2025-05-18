import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(request, { params }) {
    const { LineItemID } = params;


    // Ambil query param `lineNumber` dari request.url
    // const { searchParams } = new URL(request.url);
    // const lineNumber = searchParams.get("lineNumber");

    const parsedLineItemID = parseInt(LineItemID);
    // const parsedLineNumber = parseInt(lineNumber);

    console.log("LineItemID: ".LineItemID);
    // console.log(parsedLineNumber);

    if (isNaN(parsedLineItemID)) {
        return NextResponse.json({
            success: false,
            message: "Invalid Line Item ID or Line Number"
        }, { status: 400 });
    }

    try {
        const materialLineItem = await prisma.materialorderlineitems.findUnique({
            where: {
                LineItemID: parsedLineItemID,
                // LineNumber: parsedLineNumber
            },
            include: {
                servicecatalog_parts: true,
                materialorder: {
                    include: {
                        workorder: true
                    }
                },
            },
        });

        if (!materialLineItem) {
            return NextResponse.json({
                success: false,
                message: "Detail Data Material Order Not Found!",
                data: null
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Detail Data Material Order",
            data: materialLineItem
        }, { status: 200 });

    } catch (err) {
        console.error("🔥 ERROR in GET API:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: err.message
        }, { status: 500 });
    }
}

export async function PATCH(request, {params}) {
    const {LineItemID } = await params
    

    const parsedLineItemID = parseInt(LineItemID);
    
    if (isNaN(parsedLineItemID)) {
        return NextResponse.json({
            success: false,
            message: "Invalid Line Item ID or Line Number"
        }, { status: 400 });
    }

    console.log("LineItemID: ".parsedLineItemID)

    try {
        const body = await request.json();
        // Cek apakah AssetID ada
        const existingMOLineItems = await prisma.materialorderlineitems.findFirst({
            where: { 
                LineItemID: parsedLineItemID,
            }
        });
        
        
        if (!existingMOLineItems) {
            return NextResponse.json({
                success: false,
                message: "Line Items not found!"
            }, { status: 404 });
        }
        const {
            PartNumber,
            Description,
            ATPStatus,
            Price,
            Quantity,
            Status,
            PickPackInstructions,
            CollectionInstructions,
            CustomerResponse,
            RejectedReason,
            OtherReason,
            FailureId,
            SerialNumber,
            RemovedPartNumber,
            RemovedSerialNumber,
            RemovedPartDescription
          } = body;
        console.log(body);

        console.log(FailureId, typeof(FailureId))
        const parsedFailureId = parseInt(FailureId);
        console.log(parsedFailureId, typeof(parsedFailureId))

        // Update data
        const updatedMOLineItems = await prisma.materialorderlineitems.update({
            where: { 
                LineItemID: parsedLineItemID,
            },
            data: {
                PartNumber,
                Description,
                ATPStatus,
                Price,
                Quantity,
                Status,
                PickPackInstructions,
                CollectionInstructions,
                CustomerResponse,
                RejectedReason,
                OtherReason,
                FailureId: parsedFailureId,
                SerialNumber,
                RemovedPartNumber,
                RemovedSerialNumber,
                RemovedPartDescription
            }
        });

        return NextResponse.json({
            success: true,
            message: "Data Line Items Information Updated!",
            
            data: updatedMOLineItems
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to update Line Items",
            error: error.message
        }, { status: 500 });
    }
}