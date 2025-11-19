import { jwtDecode } from "jwt-decode";

let inMemoryToken = null;

export function getToken() {
  return inMemoryToken;
}

export function setToken(token) {
  inMemoryToken = token || null;
}

export function clearToken() {
  inMemoryToken = null;
}

export function isTokenExpired(decodedToken) {
  if (!decodedToken || typeof decodedToken.exp !== "number") {
    return false;
  }

  return decodedToken.exp * 1000 <= Date.now();
}

export function getUserFromToken(tokenOverride) {
  const token = tokenOverride ?? getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    if (isTokenExpired(decoded)) {
      clearToken();
      return null;
    }

    return {
      id: decoded.sub ?? decoded.id ?? decoded.userId ?? null,
      email: decoded.email ?? "",
      role: decoded.role ?? "",
      name: decoded.name ?? decoded.email ?? "",
      avatar: decoded.avatar ?? "",
      exp: decoded.exp,
      iat: decoded.iat,
      raw: decoded
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    clearToken();
    return null;
  }
}
