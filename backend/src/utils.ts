
import crypto from "node:crypto";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { access_token_secret, refresh_token_secret } from "./config.js";

export function random(len: number) {
    let options = "qwertyuioasdfghjklzxcvbnm12345678";
    let length = options.length;

    let ans = "";

    for (let i = 0; i < len; i++) {
        ans += options[Math.floor((Math.random() * length))] // 0 => 20
    }

    return ans;
}

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function signAccessToken(payload: object) {
    return jwt.sign(payload, access_token_secret, { expiresIn: "15m" });
}

export function signRefreshToken(payload: object) {
    const jti = crypto.randomUUID();
    const token = jwt.sign(payload, refresh_token_secret, {
        expiresIn: "7d",
        jwtid: jti,
    } satisfies SignOptions);

    return {
        token,
        jti,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    };
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, access_token_secret) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, refresh_token_secret) as JwtPayload;
}

export { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE };