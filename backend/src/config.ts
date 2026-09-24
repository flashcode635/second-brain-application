import dotenv from 'dotenv';
dotenv.config();

export const frontend_url = (process.env.FRONTEND_URL || "http://localhost:5173")
	.trim()
	.replace(/\/$/, "");
export const allowed_frontend_urls = [
	frontend_url,
	"http://localhost:5173",
	"http://192.168.1.10:5173",
].filter((origin, index, origins) => origins.indexOf(origin) === index);

export const backend_url = (process.env.BACKEND_URL || process.env.BETTER_AUTH_URL || "http://localhost:3001")
	.trim()
	.replace(/\/$/, "");

export const better_auth_secret = process.env.BETTER_AUTH_SECRET || "p@n#d$vk$qwqx-dev-only-change-me";

export const google_client_id = process.env.GOOGLE_CLIENT_ID;
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
