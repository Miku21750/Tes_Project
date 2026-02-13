import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import {
  applyRefreshCookie,
  clearRefreshCookie,
  createAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_COOKIE_NAME
} from "@/utils/auth";

export async function POST(request) {
  const existingToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (!existingToken) {
    return NextResponse.json(
      { success: false, message: "Missing refresh token" },
      { status: 401 }
    );
  }

  try {
    const hashed = hashToken(existingToken);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        hashedToken: hashed,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!storedToken?.user) {
      const response = NextResponse.json(
        { success: false, message: "Refresh token is invalid" },
        { status: 401 }
      );
      clearRefreshCookie(response);
      return response;
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    });

    const { token: newRefreshToken, hashedToken, expiresAt: refreshExpiresAt } = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        userId: storedToken.userId,
        hashedToken,
        expiresAt: refreshExpiresAt
      }
    });

    const { token: accessToken, expiresAt } = createAccessToken(storedToken.user);

    const response = NextResponse.json({
      success: true,
      accessToken,
      expiresAt,
      data: {
        id: storedToken.user.IDUser,
        name: storedToken.user.Name,
        email: storedToken.user.Email,
        role: storedToken.user.Role,
        profile: storedToken.user.ProfilePhoto
      }
    });

    applyRefreshCookie(response, newRefreshToken);

    return response;
  } catch (error) {
    console.error("Failed to refresh session", error);
    const response = NextResponse.json(
      { success: false, message: "Unable to refresh session" },
      { status: 401 }
    );
    clearRefreshCookie(response);
    return response;
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