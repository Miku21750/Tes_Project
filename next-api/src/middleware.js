import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";

//
// ALLOWED ORIGINS
//
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://javag-tracs.site"
];

//
// PUBLIC ROUTES (auth)
//
const AUTH_WHITELIST = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout"
];

export const runtime = "nodejs";
export function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log("AUTH HEADER:", req.headers.get("authorization"));
  const origin = req.headers.get("origin");
  const isAllowed = allowedOrigins.includes(origin);

  console.log("REQ ORIGIN:", origin);
  console.log("IS ALLOWED:", isAllowed);

  //
  // --- CORS HEADERS ---
  //
  const corsHeaders = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  };

  if (isAllowed) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  //
  // Handle Preflight
  //
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // default response
  let res = NextResponse.next({
    headers: corsHeaders,
  });

if (!pathname.startsWith("/api")) {
    return res;
  }

  //
  // Skip public auth routes
  //
  if (AUTH_WHITELIST.some((p) => pathname.startsWith(p))) {
    return res;
  }

  //
  // AUTH VALIDATION
  //
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  const token = authHeader.slice(7);
  const verification = verifyAccessToken(token);

  if (!verification.valid) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }


  //
  // Inject user headers
  //
  const newHeaders = new Headers(req.headers);
  newHeaders.set("x-user-id", verification.payload.sub);
  newHeaders.set("x-user-role", verification.payload.role);
  newHeaders.set("x-user-email", verification.payload.email);

  return NextResponse.next({
    request: { headers: newHeaders },
    headers: res.headers, // keep CORS
  });
}

//
// MATCHER FIX
//
export const config = {
  matcher: ["/api/(.*)"], // MUST BE THIS
};
