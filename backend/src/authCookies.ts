import type { Response } from "express";
import { randomUUID } from "node:crypto";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "./utils.js";

const COOKIE_SECURE = process.env.NODE_ENV === "production";
const COOKIE_SAMESITE: "lax" | "none" = COOKIE_SECURE ? "none" : "lax";

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAMESITE,
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAMESITE,
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: "/api/auth/refresh",
    });
}

export function setCsrfCookie(res: Response) {
    const token = randomUUID();
    res.cookie("csrfToken", token, {
        httpOnly: false,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAMESITE,
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: "/",
    });
    return token;
}

export function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", { httpOnly: true, secure: COOKIE_SECURE, sameSite: COOKIE_SAMESITE, path: "/" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: COOKIE_SECURE, sameSite: COOKIE_SAMESITE, path: "/api/auth/refresh" });
    res.clearCookie("csrfToken", { secure: COOKIE_SECURE, sameSite: COOKIE_SAMESITE, path: "/" });
}