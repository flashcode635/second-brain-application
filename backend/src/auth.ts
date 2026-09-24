import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { MongoClient } from "mongodb";

import {
    allowed_frontend_urls,
    backend_url,
    better_auth_secret,
    google_client_id,
    google_client_secret,
} from "./config.js";

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_DB_URI;
if (!mongoUri) {
    throw new Error("Please define MONGODB_URI or MONGO_DB_URI inside .env");
}

const client = new MongoClient(mongoUri);
const db = client.db("secondbrain");

const isProduction = process.env.NODE_ENV === "production";

const USERNAME_MAX_LENGTH = 10;

// Google accounts don't hand over a username, so signups via that path get
// one derived from the part of their email before the "@"; users can still
// change it later from account settings.
async function generateUsernameFromEmail(email: string) {
    const base = (email.split("@")[0] ?? "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, USERNAME_MAX_LENGTH) || "user";

    let candidate = base;
    let suffix = 1;
    while (await db.collection("users").findOne({ username: candidate })) {
        const suffixText = String(suffix);
        candidate = `${base.slice(0, USERNAME_MAX_LENGTH - suffixText.length)}${suffixText}`;
        suffix++;
    }
    return candidate;
}

export const auth = betterAuth({
    baseURL: backend_url,
    secret: better_auth_secret,
    trustedOrigins: allowed_frontend_urls,
    database: mongodbAdapter(db, { client }),
    user: {
        modelName: "users",
    },
    emailAndPassword: {
        enabled: true,
    },
    ...(google_client_id && google_client_secret
        ? {
              socialProviders: {
                  google: {
                      clientId: google_client_id,
                      clientSecret: google_client_secret,
                  },
              },
          }
        : {}),
    plugins: [username({ minUsernameLength: 3, maxUsernameLength: USERNAME_MAX_LENGTH })],
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (user.username) return { data: user };
                    const generated = await generateUsernameFromEmail(user.email);
                    return { data: { ...user, username: generated } };
                },
            },
        },
    },
    advanced: {
        defaultCookieAttributes: {
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        },
    },
});
