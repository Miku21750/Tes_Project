import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

import { generateID } from "@/utils/generateID";

export async function POST(request) {
    try{
        const body = await request.json()
        const { AssetID, CaseID, selectedWarrantyServices, selectedPartCatalog, IncidentType, OwnerID } = body;

         // 1. Create Work Order
        const WOID = await generateID("WO-", "workorder", "WOID"); 
        console.log("Generated ID:", WOID, typeof WOID);
        const workorder = await prisma.workorder.create({
            data: {
                WOID: WOID,
                CaseID,
                WorkOrderType: IncidentType,
                WorkOrderNumber: WOID,
                SystemStatus: "OPEN_UNSCHEDULED",
                OwnerID: OwnerID 
            }
        });

         // 2. Create ServiceCatalog for each selected warranty
        await prisma.servicecatalog.create({
            data: {
                AssetID,
                Service_offerID: selectedWarrantyServices.Service_offerID,
                Price: selectedWarrantyServices.Price,
                Tax: selectedWarrantyServices.Tax,
                Total: selectedWarrantyServices.Total
            }
        });
    
        // 3. Create Material Order (One only)
        const MOID = await generateID("MO-", "materialorder", "MOID");
        await prisma.materialorder.create({
            data: {
            MOID,
            WOID,
            OrderStatus: "New",
            OrderType: "Repair",
            OwnerID: OwnerID
            }
        });

         // 4. Create MaterialOrderLineItems
        for (const [i, part] of selectedPartCatalog.entries()) {
            await prisma.materialorderlineitems.create({
            data: {
                LineNumber: i + 1,
                Description: part.PartDescription,
                Price: parseFloat(part.Price),
                Quantity: part.qty || 1,
                
                materialorder: {
                    connect: { MOID: MOID }
                },   
                servicecatalog_parts: {
                    connect: { 
                        PartNumber: part.PartNumber,
                    }
                },
                Status: "New"
            }
            });
        }

        // 5. Change Case Status to InActive
        const caseUpdate = await prisma.caseinformation.update({
            where: { CaseID: CaseID },
            data: {
                CaseStatus: "InActive"
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Order created successfully", 
            WOID, 
            MOID 
        });


    }catch(err){
        return NextResponse.json({ 
            success: false, 
            message: "Failed to create order", 
            error: err.message 
        }, { 
            status: 500 
        });
    }
}