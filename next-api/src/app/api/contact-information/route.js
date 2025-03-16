import { NextResponse } from "next/server";

import prisma  from "../../../../prisma/client";

export async function GET(request) {
    //get search parameter
    const { searchParams } = new URL(request.url);

    //extract query parameter
    const first_name = searchParams.get("first_name")
    const last_name = searchParams.get("last_name")
    const email = searchParams.get("email")
    const siteAccountID = searchParams.get("SiteAccountID")

    //prisma query filter
    const filters = {};
    if(first_name){
        filters.FirstName = { contains: first_name }
    }
    if(last_name){
        filters.LastName = { contains: last_name }
    }
    if(email){
        filters.Email = { contains: email }
    }
    if(siteAccountID){
        filters.SiteAccountID = parseInt(siteAccountID, 10);
    }
    //get all data
    const contact_information = await prisma.contact_information.findMany({
        where: Object.keys(filters).length > 0 ? filters : undefined
    });
    return NextResponse.json(
        {
            success: true,
            message: "List Data Contact Information",
            data: contact_information,
        },
        {
            status:200,
        }
    );
}

export async function POST(request) {
    //get all request
    const { 
        SiteAccountID,  
        Salutation,
        FirstName,
        LastName,
        Email,
        PreferredLanguage,
        Phone,
        Mobile,
        WorkPhone,
        WorkExtension,
        OtherPhone,
        OtherExtension,
        Fax,
        AddressLine1,
        AddressLine2,
        City,
        StateProvince,
        Country,
        ZipPostalCode
    } = await request.json();

    //create data 
    const contact_information = await prisma.contact_information.create({
        data:{
            SiteAccountID: SiteAccountID,  
            Salutation: Salutation,
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            PreferredLanguage: PreferredLanguage,
            Phone: Phone,
            Mobile: Mobile,
            WorkPhone: WorkPhone,
            WorkExtension: WorkExtension,
            OtherPhone: OtherPhone,
            OtherExtension: OtherExtension,
            Fax: Fax,
            AddressLine1: AddressLine1,
            AddressLine2: AddressLine2,
            City: City,
            StateProvince: StateProvince,
            Country: Country,
            ZipPostalCode: ZipPostalCode
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Contact Information Created Successfully!",
            data: contact_information,
        },
    )
}