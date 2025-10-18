import jwt, {} from "jsonwebtoken";
import { jwt_password } from "./config.js";
export const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header, jwt_password);
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }
        const decodedId = decoded.id;
        req.userId = decodedId;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not logged in"
        });
    }
};
//# sourceMappingURL=midlleware.js.map