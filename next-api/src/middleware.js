import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";

const AUTH_WHITELIST = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout"
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (AUTH_WHITELIST.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const verification = verifyAccessToken(token);

  if (!verification.valid) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const headers = new Headers(request.headers);
  headers.set("x-user-id", String(verification.payload?.sub ?? ""));
  headers.set("x-user-role", verification.payload?.role ?? "");
  headers.set("x-user-email", verification.payload?.email ?? "");

  return NextResponse.next({
    request: {
      headers
    }
  });
}

export const config = {
  matcher: "/api/:path*"
};
