import express from 'express'

import { userMiddleware} from './midlleware.js';

import {pingHandler, SignUpHandler,
 SignInHandler,
 CreateContentHandler,  ViewSharedBrainHandler, 
 FindContentHandler, DeleteContentHandler, 
 LinkedInHandler, ShareBrainHandler} from './handlers.js';

import cors from 'cors'; 

const app = express();
app.use(express.json());
app.use(cors());

app.get('/ping', pingHandler);

app.post('/app/v1/signup',SignUpHandler);


app.post("/app/v1/signin",SignInHandler )

// content create krne ke liye
app.post("/app/v1/content", userMiddleware, CreateContentHandler)

// content find krne ke liye
app.get("/app/v1/content", userMiddleware,FindContentHandler)

// delete content by link
app.delete("/app/v1/content", userMiddleware, DeleteContentHandler)

// API ENDPOINT
app.get('/api/linkedinpreview', LinkedInHandler);

// share brain link create and delete
app.post("/app/v1/brain/share", userMiddleware, ShareBrainHandler)

// view shared brain
app.get("/app/v1/brain/:sharelink", ViewSharedBrainHandler)


app.listen(3001,"0.0.0.0", () => {
  console.log('Server is running on http://localhost:3001');
});
