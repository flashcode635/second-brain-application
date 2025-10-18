import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { jwt_password } from "./config.js";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, jwt_password)
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        const decodedId = (decoded as JwtPayload).id;
        req.userId = decodedId;
        next()
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}