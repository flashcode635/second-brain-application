import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { jwt_password } from "./config.js";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    try {
        if (typeof header !== "string" || !header.trim()) {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }

        const decoded = jwt.verify(header, jwt_password);
        if (typeof decoded === "string" || !(decoded as JwtPayload).id) {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }

        req.userId = (decoded as JwtPayload).id;
        return next();
    } catch {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }
}