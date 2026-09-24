import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { BACKEND_URL } from "./config";

// In dev BACKEND_URL is "" (relative, proxied by Vite) — better-auth's client
// needs an absolute URL or none at all, so only pass one when we actually
// have a cross-origin backend to point at.
export const authClient = createAuthClient({
    ...(BACKEND_URL ? { baseURL: `${BACKEND_URL}/api/auth` } : {}),
    plugins: [usernameClient()],
});

export const { useSession } = authClient;
