import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { BACKEND_URL } from "./config";
import { useAuthStore } from "./store";

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

function csrfToken() {
    return document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("csrfToken="))
        ?.split("=")[1];
}
export function hasSessionHint() {
  return document.cookie.split("; ").some((c) => c.startsWith("csrfToken="));
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.withCredentials = true;
    if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase() || "")) {
        const token = csrfToken();
        if (token) config.headers.set("X-CSRF-Token", token);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
        const requestUrl = request?.url || "";
        if (error.response?.status !== 401 || !request || request._retry || requestUrl.includes("/api/auth/refresh")) {
            return Promise.reject(error);
        }

        request._retry = true;
        refreshPromise ??= api.post("/api/auth/refresh").then(() => undefined).finally(() => {
            refreshPromise = null;
        });

        try {
            await refreshPromise;
            return api(request);
        } catch (refreshError) {
            if (!requestUrl.includes("/api/auth/me")) {
                useAuthStore.getState().clearUser();
                window.location.assign("/signin");
            }
            return Promise.reject(refreshError);
        }
    },
);

export default api;