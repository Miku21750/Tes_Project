import axios from "axios";
import { clearToken, getToken, setToken } from "@/lib/utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ApiCustomer = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

ApiCustomer.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshPromise = null;

async function requestNewAccessToken() {
    if (!refreshPromise) {
        refreshPromise = axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
    }

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

ApiCustomer.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const shouldRetry =
            status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/api/auth/login") &&
            !originalRequest.url?.includes("/api/auth/refresh");

        if (!shouldRetry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshResponse = await requestNewAccessToken();
            const newToken = refreshResponse.data?.accessToken;

            if (!newToken) {
                throw new Error("Refresh endpoint did not return an access token");
            }

            setToken(newToken);
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return ApiCustomer(originalRequest);
        } catch (refreshError) {
            clearToken();
            return Promise.reject(refreshError);
        }
    }
);

export default ApiCustomer;