import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const caseId = searchParams.get("caseId");

        const actionlog = await prisma.actionLog.findMany({
            where: caseId ? { CaseId: caseId } : undefined,
            include: {
                changedByUser: true, // Include user info if needed
            },
        });
        return NextResponse.json({
            success: true,
            message: "List Data Action Log Information",
            data: actionlog,
        })
    } catch (error) {
        console.error("🔥 ERROR in GET API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const {
            model,
            dataOld,
            dataNew,
            changedBy,
            logDescription,
            ReferenceId,
            CaseId
        } = await request.json()

        console.log(CaseId, ReferenceId);
        const existingActionLog = await prisma.ActionLog.findFirst({
            where: {CaseId : CaseId}
        })
       
        const actionLog = await prisma.ActionLog.create({
            data:{
                CaseID_toActionLog: {
                    connect: {
                        CaseID: CaseId
                    }
                },

                model: model,
                dataOld:dataOld,
                dataNew: dataNew,
                logDescription: logDescription,
                ReferenceId: ReferenceId,
                changedByUser: {
                    connect: {
                        IDUser: changedBy // Make sure this ID matches the `User` model PK
                    }
                }
            }
        })
        return NextResponse.json({
            success: true,
            message: "ActionLog Created Successfully",
            data: actionLog
        },{
            status: 201
        })
        
    } catch (error) {
        console.error("🔥 ERROR in GET API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: error.message
        }, { status: 500 });
    }
}