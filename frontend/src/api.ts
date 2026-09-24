import axios, { type AxiosError } from "axios";
import { BACKEND_URL } from "./config";

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

// Session cookies are managed by better-auth; on an expired/invalid session
// for one of our own app routes, bounce to sign-in.
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const requestUrl = error.config?.url || "";
        if (error.response?.status === 401 && !requestUrl.includes("/api/auth/")) {
            window.location.assign("/signin");
        }
        return Promise.reject(error);
    },
);

export default api;