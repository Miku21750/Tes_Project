import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import ApiCustomer from "@/api";
import { getUserFromToken, setToken, clearToken } from "@/lib/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshTimerRef = useRef(null);
    const refreshAccessTokenRef = useRef(null);

    const clearRefreshTimer = useCallback(() => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
    }, []);

    const applySession = useCallback((token) => {
        clearRefreshTimer();
        if (!token) {
            clearToken();
            setUser(null);
            return null;
        }

        setToken(token);
        const nextUser = getUserFromToken(token);
        setUser(nextUser);
        return nextUser;
    }, [clearRefreshTimer]);

    const scheduleRefresh = useCallback((payload) => {
        clearRefreshTimer();
        if (!payload?.exp) {
            return;
        }

        const msUntilExpiry = payload.exp * 1000 - Date.now();
        const refreshIn = Math.max(msUntilExpiry - 30_000, 0);

        refreshTimerRef.current = setTimeout(() => {
            refreshAccessTokenRef.current?.().catch(() => {
                applySession(null);
            });
        }, refreshIn);
    }, [applySession, clearRefreshTimer]);

    const refreshAccessToken = useCallback(async () => {
        try {
            const { data } = await ApiCustomer.post("/api/auth/refresh");
            if (!data?.accessToken) {
                throw new Error("Missing access token in refresh response");
            }

            const payload = applySession(data.accessToken);
            scheduleRefresh(payload);
            return payload;
        } catch (error) {
            applySession(null);
            throw error;
        }
    }, [applySession, scheduleRefresh]);

    useEffect(() => {
        refreshAccessTokenRef.current = refreshAccessToken;
    }, [refreshAccessToken]);

    const login = useCallback((token) => {
        const payload = applySession(token);
        scheduleRefresh(payload);
    }, [applySession, scheduleRefresh]);

    const logout = useCallback(async () => {
        clearRefreshTimer();
        applySession(null);
        try {
            await ApiCustomer.post("/api/auth/logout");
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }, [applySession, clearRefreshTimer]);

    const refreshSession = useCallback(() => refreshAccessToken(), [refreshAccessToken]);

    useEffect(() => {
        refreshAccessToken()
            .catch(() => null)
            .finally(() => setLoading(false));

        return () => {
            clearRefreshTimer();
        };
    }, [refreshAccessToken, clearRefreshTimer]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
