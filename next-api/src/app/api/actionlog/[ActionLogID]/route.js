import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, {params}) {
    const { ActionLogID } = await params

    if (isNaN(ActionLogID)){
        return NextResponse.json(
            { success: false, message: "Invalid Action Log ID" },
            { status: 400 }
        );
    }

    const actionLog = await prisma.ActionLog.findUnique({
        where: {
            id: ActionLogID
        },
        include: {
            changedByUser: true,
        }
    })
    if(!actionLog){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Action Log Not Found!",
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
            message: "Detail Data Action Log ",
            data: actionLog,
        },
        {
            status: 200,
        }
    );
}

export async function PATCH(request, {params}) {
    const { ActionLogID } = await params

    if (isNaN(ActionLogID)){
        return NextResponse.json(
            { success: false, message: "Invalid Action Log ID" },
            { status: 400 }
        );
    }

    const existing = await prisma.ActionLog.findUnique({
        where: {
            id: ActionLogID
        }
    })
    if(!existing){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Action Log Not Found!",
                data: null,
            },
            {
                status: 404,
            }
        );
    }

    const {
        model,
        dataOld,
        dataNew,
        changedBy,
        logDescription,
        CaseID
    } = await request.json()

    const updatedActionLog = await prisma.ActionLog.update({
        where: {id: ActionLogID},
        data: {
            model,
            dataOld,
            dataNew,
            changedBy,
            logDescription,
            CaseId: CaseID
        }
    })
    return NextResponse.json({
        success: true,
        message: "ActionLog updated successfully.",
        data: updatedActionLog,
    });
}