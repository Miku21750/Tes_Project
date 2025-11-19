import { verifyAccessToken } from "@/utils/auth";

export function getTokenUserId(request) {
  try {
    const forwardedUserId = request.headers.get('x-user-id');
    if (forwardedUserId) {
      const parsed = parseInt(forwardedUserId, 10);
      return Number.isNaN(parsed) ? forwardedUserId : parsed;
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return null;

    const verification = verifyAccessToken(token);
    if (!verification.valid) {
      return null;
    }

    const payload = verification.payload;
    return payload?.sub ?? payload?.id ?? null;
  } catch {
    return null;
  }
}
