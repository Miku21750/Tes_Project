import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_ISSUER = process.env.JWT_ISSUER || "tes-app";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "tes-app-users";
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL_DAYS = parseInt(process.env.JWT_REFRESH_TOKEN_TTL_DAYS || "14", 10);
export const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
export const REFRESH_COOKIE_NAME = "refresh_token";

export function createAccessToken(user) {
  const payload = {
    sub: user.IDUser,
    id: user.IDUser,
    email: user.Email,
    role: user.Role,
    name: user.Name,
    avatar: user.ProfilePhoto || "",
    jti: crypto.randomUUID()
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });

  const decoded = jwt.decode(token);
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : null;

  return { token, expiresAt };
}

export function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    });

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error };
  }
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRefreshToken() {
  const token = crypto.randomBytes(64).toString("hex");
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  return { token, hashedToken, expiresAt };
}

export function applyRefreshCookie(response, value, { maxAge = REFRESH_TOKEN_TTL_MS / 1000 } = {}) {
  response.cookies.set(REFRESH_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge
  });

  return response;
}

export function clearRefreshCookie(response) {
  return applyRefreshCookie(response, "", { maxAge: 0 });
}
