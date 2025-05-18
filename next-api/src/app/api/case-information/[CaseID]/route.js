import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    //get params id
    const url = new URL(request.url);
    const caseID = url.pathname.split("/").pop(); 

    if (!caseID) {
        return NextResponse.json(
            { success: false, message: "Invalid Case ID" },
            { status: 400 }
        );
    }

    //get detail post
    const case_information = await prisma.caseinformation.findUnique({
        where: {
            CaseID: caseID,
        },
        include: { 
            asset_information: {
                include:{
                    product_information: {
                        include: {
                            product_type: true
                        }
                    }
                }
            } ,
            contact_information: true, 
            site_account: true,
            servicecatalog: {
                include: {
                    warranty_services: {
                        select: {
                            Service_offerID: true,
                            Service_description: true,
                            CTat_RTime: true,
                            Price: true,
                            Tax: true,
                            Total: true,
                        }
                    }
                }
            }, 
            global_trade_check: true,
            caseresolution: true,
            accessory: true,
        }
    });

    if(!case_information){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Case Not Found!",
                data: null,
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json(
        {
            success:true,
            message: "Detail Data Case",
            data: case_information,
        },
        {
            status: 200,
        }
    );
}

// update data
export async function PATCH(request, { params }) {
    const { CaseID } = await params;
    const caseID = CaseID;
    const body = await request.json();

    // Build data object dynamically
    const updatableFields = [
        'SiteAccountID',
        'ContactID',
        'AssetID',
        'CaseSubject',
        'CaseType',
        'KCI_Flag',
        'IncomingChannel',
        'CaseStatus',
        'CasePriority',
        'CustomerSeverity',
        'CaseClosedDate',
        'CaseNote',
        'SymptomCode',
        'CaseResolution',
        'OTCCode',
        'id_csr',
    ];

    const dataToUpdate = {};

    const existing = await prisma.caseinformation.findUnique({ where: { CaseID: caseID } });

    for (const field of updatableFields) {
        if (
            body[field] !== undefined &&
            body[field] !== null &&
            body[field] !== existing[field]
        ) {
            dataToUpdate[field] = body[field];
        }
    }

    const case_information = await prisma.caseinformation.update({
        where: { CaseID: caseID },
        data: dataToUpdate,
    });

    return NextResponse.json(
        {
            success: true,
            message: "Case Information Updated!",
            data: case_information,
        },
        {
            status: 200,
        }
    )
}


//delete data
export async function DELETE(request, { params }) {
    const { CaseID } = await params;
    const caseID = CaseID;
    
    await prisma.caseinformation.delete(
        {
            where: {
                CaseID: caseID,
            }
        },
        {
            status: 200
        }
    );

    return NextResponse.json({
        success: true,
        message: "Data Case Deleted"
    })
}