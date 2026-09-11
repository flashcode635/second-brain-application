import express from 'express'
import cookieParser from 'cookie-parser';

import { csrfMiddleware, userMiddleware} from './midlleware.js';

import {pingHandler, SignUpHandler,
 SignInHandler,
 RefreshHandler, LogoutHandler, MeHandler,
 CreateContentHandler,  ViewSharedBrainHandler, 
 FindContentHandler, DeleteContentHandler, 
 LinkedInHandler, ShareBrainHandler} from './handlers.js';

import cors from 'cors';
import { allowed_frontend_urls } from './config.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
  origin: (origin, callback) => {
    if (!origin || allowed_frontend_urls.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}
));

app.get('/ping', pingHandler);

app.post('/app/v1/signup',SignUpHandler);


// app.post("/app/v1/signin",SignInHandler )
app.post("/api/auth/login", SignInHandler);

app.post("/api/auth/refresh", RefreshHandler);
app.post("/api/auth/logout", csrfMiddleware, LogoutHandler);
app.get("/api/auth/me", userMiddleware, MeHandler);

// content create krne ke liye
app.post("/app/v1/content", userMiddleware, csrfMiddleware, CreateContentHandler)

// content find krne ke liye
app.get("/app/v1/content", userMiddleware,FindContentHandler)

// delete content by link
app.delete("/app/v1/content", userMiddleware, csrfMiddleware, DeleteContentHandler)

// API ENDPOINT
app.get('/api/linkedinpreview', LinkedInHandler);

// share brain link create and delete
app.post("/app/v1/brain/share", userMiddleware, csrfMiddleware, ShareBrainHandler)

// view shared brain
app.get("/app/v1/brain/:sharelink", ViewSharedBrainHandler)


app.listen(3001,"0.0.0.0", () => {
  console.log('Server is running on http://localhost:3001');
});
