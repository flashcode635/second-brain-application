import express from 'express'
import cookieParser from 'cookie-parser';

import { originMiddleware, userMiddleware} from './midlleware.js';
import { auth } from './auth.js';
import { toNodeHandler } from 'better-auth/node';

import {pingHandler,
 GetSettingsHandler, UpdateSettingsHandler,
 CreateContentHandler,  ViewSharedBrainHandler,
 FindContentHandler, DeleteContentHandler, UpdateContentHandler,
 LinkedInHandler, ShareBrainHandler} from './handlers.js';

import cors from 'cors';
import { frontend_url} from './config.js';

const app = express();
app.use(cors(
  {
  origin: [frontend_url,
    "http://localhost:5173",
    "http://192.168.1.10:5173"],
   credentials: true, // needed because get-session relies on cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}
));

// Better Auth owns everything under /api/auth/* (sign-up, sign-in, Google
// OAuth, sessions, sign-out, user updates) — mount it before body parsing.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.get('/ping', pingHandler);

// per-user settings (theme, etc.)
app.get("/app/v1/settings", userMiddleware, GetSettingsHandler);
app.patch("/app/v1/settings", userMiddleware, originMiddleware, UpdateSettingsHandler);

// content create krne ke liye
app.post("/app/v1/content", userMiddleware, originMiddleware, CreateContentHandler)

// content find krne ke liye
app.get("/app/v1/content", userMiddleware,FindContentHandler)

// update content (edit)
app.patch("/app/v1/content", userMiddleware, originMiddleware, UpdateContentHandler)

// delete content by link
app.delete("/app/v1/content", userMiddleware, originMiddleware, DeleteContentHandler)

// API ENDPOINT
app.get('/api/linkedinpreview', LinkedInHandler);

// share brain link create and delete
app.post("/app/v1/brain/share", userMiddleware, originMiddleware, ShareBrainHandler)

// view shared brain
app.get("/app/v1/brain/:sharelink", ViewSharedBrainHandler)


app.listen(3001,"0.0.0.0", () => {
  console.log('Server is running on http://localhost:3001');
});
