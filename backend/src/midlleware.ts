import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./utils.js";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;
        if (typeof token !== "string" || !token.trim()) {
            return res.status(401).json({
                message: "You are not logged in"
            });
        }

        const decoded = verifyAccessToken(token);
        if (!decoded.id) {
            return res.status(401).json({
                message: "You are not logged in"
            });
        }

        req.userId = String(decoded.id);
        req.user = { id: req.userId };
        return next();
    } catch {
        return res.status(401).json({
            message: "You are not logged in"
        });
    }
};

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.get("X-CSRF-Token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }

    return next();
};