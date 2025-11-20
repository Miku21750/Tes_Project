import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || ''
export const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://javag-tracs.site"
];



export function middleware(req) {
    // retrieve the current response

    const origin = req.headers.get("origin");
    const isAllowed = allowedOrigins.includes(origin);

    console.log("REQ ORIGIN:", origin);
    console.log("IS ALLOWED:", isAllowed);

    // Build base response
    let res = NextResponse.next();

    // --- Apply CORS headers ---
    if (isAllowed) {
        res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    // --- Handle OPTIONS preflight early! ---
    if (req.method === "OPTIONS") {
        const preflight = new NextResponse(null, { status: 200 });
        if (isAllowed) preflight.headers.set("Access-Control-Allow-Origin", origin);

        preflight.headers.set("Access-Control-Allow-Credentials", "true");
        preflight.headers.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        preflight.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        );

        return preflight;
    }

    return res;


}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}