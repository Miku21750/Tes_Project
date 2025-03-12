import { NextResponse } from "next/server";

import prisma  from "../../../../prisma/client";

export async function GET(request) {
    //get search parameter
    const { searchParams } = new URL(request.url);

    //extract query parameter
    const serialNumber = searchParams.get("SerialNumber")
    const productName = searchParams.get("ProductName")

    //prisma query filter
    
    const filters = {
        SerialNumber : serialNumber ? { contains: serialNumber } : undefined,
        ProductName : productName ? { contains: productName } : undefined,
    };
    // if(serialNumber){
    //     filters.SerialNumber = { contains: serialNumber }
    // }
    // if(productName){
    //     filters.ProductName = { contains: productName }
    // }
    //get all data
    const asset_information = await prisma.asset_information.findMany({
        where: Object.keys(filters).length > 0 ? filters : undefined,
        include:
        {
            site_account: true,
            contact_information:true
        }
    });
    return NextResponse.json(
        {
            success: true,
            message: "List Data Asset Information",
            data: asset_information,
        },
        {
            status:200,
        }
    );
}

export async function POST(request) {
    //get all request
    const { 
        SerialNumber,
        ProductName,
        ProductNumber,
        ProductLine,
        SiteAccountID,
        ContactID
    } = await request.json();

    //create data 
    const asset_information = await prisma.asset_information.create({
        data:{
            SerialNumber: SerialNumber,
            ProductName: ProductName,
            ProductNumber: ProductNumber,
            ProductLine: ProductLine,
            SiteAccountID: SiteAccountID,
            ContactID: ContactID
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Asset Information Created Successfully!",
            data: asset_information,
        },
        { 
            status: 201
        }
    )
}