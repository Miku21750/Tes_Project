import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { clearRefreshCookie, hashToken, REFRESH_COOKIE_NAME } from "@/utils/auth";

export async function POST(request) {
  const token = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  const response = NextResponse.json({ success: true });

  if (!token) {
    clearRefreshCookie(response);
    return response;
  }

  try {
    await prisma.refreshToken.updateMany({
      where: {
        hashedToken: hashToken(token)
      },
      data: { revokedAt: new Date() }
    });
  } catch (error) {
    console.error("Failed to revoke refresh token", error);
  }

  clearRefreshCookie(response);
  return response;
}
