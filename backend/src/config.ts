import dotenv from 'dotenv';
dotenv.config();

export const jwt_password = process.env.JWT_PASSWORD || "p@n#d$vk$qwqx"
export const access_token_secret = process.env.ACCESS_TOKEN_SECRET || jwt_password;
export const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET || `${jwt_password}-refresh`;
export const frontend_url = (process.env.FRONTEND_URL || "http://localhost:5173")
	.trim()
	.replace(/\/$/, "");
export const allowed_frontend_urls = [
	frontend_url,
	"http://localhost:5173",
	"http://192.168.1.10:5173",
].filter((origin, index, origins) => origins.indexOf(origin) === index);
