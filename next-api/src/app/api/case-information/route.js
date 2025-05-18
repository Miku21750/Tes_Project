import { NextResponse } from "next/server";

import prisma  from "../../../../prisma/client";

import { generateID } from "@/utils/generateID";
// import * as XLSX from 'xlsx';

export async function GET(request) {
  //get search parameter
  const { searchParams } = new URL(request.url);

  const exportExcel = searchParams.get("export") === "excel";

  //extract query parameter
  const CaseStatus = searchParams.get("CaseStatus");

  //prisma query filter
  const filters = {};
  if (CaseStatus) {
    filters.CaseStatus = CaseStatus;
  }
  const openCount = await prisma.caseinformation.count({
    where: {
      CaseStatus: "Open",
    },
  });
  const closedCount = await prisma.caseinformation.count({
    where: {
      CaseStatus: "Close",
    },
  });
  const inActiveCount = await prisma.caseinformation.count({
    where: {
      CaseStatus: "InActive",
    },
  });
  //get all data
  const case_information = await prisma.caseinformation.findMany({
    where: Object.keys(filters).length > 0 ? filters : undefined,
    include: {
      asset_information: {
        select: {
          AssetID: true,
          SerialNumber: true,
          ProductNumber: true,
          product_information: {
            select: {
              ProductName: true,
              ProductLine: true,
            },
          },
        },
      },
      contact_information: {
        select: {
          ContactID: true,
          FirstName: true,
          LastName: true,
          site_account: {
            select: { Company: true },
          },
        },
      },
      servicecatalog: {
        select: {
          ServiceCatalogID: true,
          Service_offerID: true,
          PartNumber: true,
          WarrantyStatus: true,
          Price: true,
          Tax: true,
          Total: true,
          warranty_services: {
            select: {
              Service_offerID: true,
              Service_description: true,
              CTat_RTime: true,
              Price: true,
              Total: true,
              Tax: true,
            },
          },
        },
      },
      createdByUser: true,
      global_trade_check: true,
      caseresolution: true,
      otcCodeTable: true,
      casenotes_caseinformation_CaseNoteTocasenotes: true,
      workorder: true,
      accessory: true
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "List Data Case",
      data: case_information.map((caseData) => ({
        CaseID: caseData.CaseID,
        // CreatedOn: caseData.CreatedOn,
        CreatedOn: caseData.CreatedOn.toLocaleString("id-ID"),
        CaseSubject: caseData.CaseSubject,
        CustomerAccount:
          caseData.contact_information?.site_account?.Company || "No Company",
        Primary: `${caseData.contact_information?.FirstName || ""} ${
          caseData.contact_information?.LastName || ""
        }`.trim(),
        HW: "N/A", //wtf is this
        SerialNumber: caseData.asset_information?.SerialNumber || "No Serial",
        ProductNumber:
          caseData.asset_information?.ProductNumber || "No Product Number",
        ProductName:
          caseData.asset_information?.product_information?.ProductName ||
          "No Product Name",
        CreatedName: caseData.User?.Name, // Replace with the database owned
        Owner: caseData.User?.Name, // Replace with the database owned
        WorkGroup: "Miku21", // Replace with the database owned
        CaseStatus: caseData.CaseStatus,
        caseinformation: caseData,
      })),
      value: {
        open: openCount,
        closed: closedCount,
        inActive: inActiveCount,
      },
    },
    {
      status: 200,
    }
  );
}

export async function POST(request) {
    //get all request
    const { 
        SiteAccountID,
        ContactID,
        AssetID,
        CaseSubject,
        CaseType,
        KCI_Flag,
        IncomingChannel,
        CaseStatus,
        CasePriority,
        CustomerSeverity,
        CaseClosedDate,
        CaseNote,
        SymptomCode,
        CaseResolution,
        CreatedBy,
        ProblemDescription,
        CaseNoteProduct,
        accessories,
    } = await request.json();

    const CaseID = await generateID("C-", "caseinformation", "CaseID")
    console.log("Generated ID:", CaseNoteProduct);
    //validation
    if (!AssetID && !ContactID ) {
        return NextResponse.json(
            {
                success: false,
                message: "Asset/Contact selection is required to create a case.",
            },
            { status: 400 }
        );
    }
    
    //create data 
    const case_information = await prisma.caseinformation.create({
        data:{
          CaseID: CaseID,
          SiteAccountID: SiteAccountID,
          ContactID: ContactID,
          AssetID: AssetID,
          CaseSubject: CaseSubject,
          CaseType: CaseType,
          KCI_Flag: KCI_Flag,
          IncomingChannel: IncomingChannel,
          CaseStatus: CaseStatus,
          CasePriority: CasePriority,
          CustomerSeverity: CustomerSeverity,
          CaseClosedDate: CaseClosedDate,
          CaseNote: CaseNote,
          SymptomCode: SymptomCode,
          CaseResolution: CaseResolution,
          CreatedBy: parseInt(CreatedBy),
          ProblemDescription: ProblemDescription,
          CaseProductNote : CaseNoteProduct,
          ...(Array.isArray(accessories) && accessories.length > 0 && {
            accessory: {
              create: accessories.map((acc) => ({
                Accessories: acc.name,
                Note: acc.note,
                CT_SNCode: acc.code,
              })),
            },
          }),
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Case Created Successfully!",
            data: case_information,
        },
        { 
            status: 201
        }
    )
}