import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
import { allowed_frontend_urls } from "./config.js";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
        if (!session?.user) {
            return res.status(401).json({ message: "You are not logged in" });
        }

        req.userId = session.user.id;
        req.user = { id: session.user.id };
        return next();
    } catch {
        return res.status(401).json({ message: "You are not logged in" });
    }
};

// Better Auth's own /api/auth/* routes validate the request origin against
// trustedOrigins already; this covers our own state-changing app routes.
export const originMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.get("origin");
    if (origin && !allowed_frontend_urls.includes(origin)) {
        return res.status(403).json({ message: "Origin is not allowed" });
    }
    return next();
};
