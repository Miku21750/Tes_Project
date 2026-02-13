import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
    applyRefreshCookie,
    createAccessToken,
    generateRefreshToken
} from "@/utils/auth";

const loginSchema = z.object({
    identifier: z
        .string()
        .min(3, { message: "Identifier is required" })
        .refine(
            (val) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[a-zA-Z0-9_-]{3,30}$/.test(val),
            {
                message: "Identifier must be a valid email or username"
            }
        ),
    password: z
        .string()
        .min(2, { message: "Password must be at least 3 characters" })
});

export async function GET() {
    return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
            message: "Login Berhasil , Selamat datang -.Perid"
        }
    });
}

export async function POST(request) {
    try {
        const body = await request.json();

        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            console.log("Zod errors array:", parsed.error.issues);
            const errorMessages = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));

            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: errorMessages
                },
                { status: 400 }
            );
        }

        const { identifier, password } = parsed.data;

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ Email: identifier }, { Username: identifier }]
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
        }

        const { token, expiresAt } = createAccessToken(user);
        const { token: refreshToken, hashedToken, expiresAt: refreshExpiresAt } = generateRefreshToken();

        await prisma.refreshToken.create({
            data: {
                userId: user.IDUser,
                hashedToken,
                expiresAt: refreshExpiresAt
            }
        });

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            accessToken: token,
            expiresAt,
            data: {
                id: user.IDUser,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                profile: user.ProfilePhoto
            }
        });

        applyRefreshCookie(response, refreshToken);

        return response;
    } catch (error) {
        console.error("🔥 Login Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}