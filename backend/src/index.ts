import express from 'express'
import * as z from "zod";
import jwt from "jsonwebtoken";
import {connectDB } from './models/db.js';
import {UserModel} from './models/userSchema.js';
import { ContentModel } from './models/contentSchema.js';
import { userMiddleware} from './midlleware.js';
import { jwt_password } from './config.js';
import { random } from './utils.js';
import LinkModel from './models/linkSchema.js';

const app = express();
app.use(express.json());
import cors from 'cors'; 
app.use(cors());

// while (1) {
//   fetch("https://www.google.com/", {
//     method: "GET",
   
//   })
// }

if (!jwt_password) {
  throw new Error("JWT_PASSWORD is not set in environment variables");
}

const UserObject= z.object({
  username: z.string()
             .min(3, { message: "Too short username" })
             .max(10, { message: "Username is Longer than expected " }),
  password: z.string()
             .min(3,{ message: "Too short password" })
             .max(12,{ message: "password is Longer than expected " })
})

app.get('/ping', (req, res) => {
  // Returns instantly. No DB calls, no heavy logging.
  res.status(200).send('OK');
});

app.post('/app/v1/signup', async(req, res) => {

type UserObjectType = z.infer<typeof UserObject>
try {
        const {username, password}: UserObjectType = UserObject.parse(req.body);
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        await connectDB();

     const existingUser = await UserModel.findOne({
       username: username as string,
       password: password as string,
     })
    //  checking existing user
     if (existingUser){
      return res.status(400).json({
        message:"user exist please sign in",
      })
     }
        const newUser = await UserModel.create({
            username: username as string,
            password: password as string,
        });

        res.status(201).json({ 
            message: 'User registered success',
            id: newUser._id
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


app.post("/app/v1/signin", async(req,res)=>{
   const {username, password}= UserObject.parse(req.body);
   if (!username|| !password) {
      return res.status(401).json({
        message:"enter credentials properly",
      })
   } 
   try {
     await connectDB();
 
    const existingUser= await UserModel.findOne({
       username:username,
       password:password
     })
 
 if (!existingUser) {
   return res.status(401).json(
     {      
       message: "user not found, please sign up",
     }
   )
 } else {
  const token = jwt.sign({
    id: existingUser._id
  }, jwt_password)
     return res.status(200).json({
       message:"logging in....",
      token: token,
      id: existingUser._id
     })
 }
   } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
       message:"user login failed!",
    })
   }

})

// content create krne ke liye
app.post("/app/v1/content", userMiddleware, async(req,res)=>{
 const link = req.body.link;
    const type = req.body.type;
    await connectDB();
    // @ts-ignore
  const newContent= await ContentModel.create({
      link:link,
      type:type,
      title: req.body.title,
      userId: req.userId,
      tags: Array.isArray(req.body.tags) ? req.body.tags : []
   })

    res.json({
        message: "Content added",
        content: newContent
    })
    
})

// content find krne ke liye
app.get("/app/v1/content", userMiddleware,async(req,res)=>{
   await connectDB();   
   const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})

// delete content by link
app.delete("/app/v1/content", userMiddleware,async(req,res)=>{
    try {
      const link = req.body.link;
      if (typeof link !== "string" || !link.trim()) {
        return res.status(400).json({ message: "link is required" });
      }

      await connectDB();
      const deletedResult = await ContentModel.deleteOne({
        link: link.trim(),
        userId: req.userId,
      });

      if (deletedResult.deletedCount === 0) {
        return res.status(404).json({ message: "Content not found" });
      }

      return res.status(200).json({
        message: "Content deleted",
      });
    } catch (error) {
      console.error("Delete content error:", error);
      return res.status(500).json({ message: "Failed to delete content" });
    }
})

async function resolveLinkedInLink(shortUrl: string): Promise<string> {
    try {
        const response = await fetch(shortUrl, { 
            redirect: 'follow',
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } 
        });
        return response.url; 
    } catch (error) {
        return shortUrl; 
    }
}

function extractMetaFromUrl(fullUrl: string) {
    const idMatch = fullUrl.match(/(activity-|urn:li:activity:|urn:li:share:)(\d+)/);
    const postId = idMatch ? idMatch[2] : null;

    const slugMatch = fullUrl.match(/\/posts\/[^_]+_(.*)-activity-/i);
    let title = "LinkedIn Post";
    if (slugMatch!=null && slugMatch[1]) {
        title = slugMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    const authorMatch = fullUrl.match(/\/posts\/([^_]+)_/);
    const author = authorMatch ? `@${authorMatch[1]}` : "Unknown Author";

    return {
        success: true,
        provider: "linkedin",
        postId,
        title,
        author,
        embedUrl: postId ? `https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}` : null,
        originalUrl: fullUrl
    };
}

// API ENDPOINT
app.get('/api/linkedinpreview', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL required" });

    try {
        // 1. Link resolve karo (lnkd.in -> linkedin.com)
        const resolvedUrl = await resolveLinkedInLink(url as string);
        
        // 2. Metadata extract karo
        const metaData = extractMetaFromUrl(resolvedUrl);
        console.log("metaData: ") 
        console.log(metaData) 
        // 3. Frontend ko bhejo
        res.json(metaData);
    } catch (error) {
        res.status(500).json({ error: "Failed to process link" });
    }
});

app.post("/app/v1/brain/share", userMiddleware,async(req,res)=>{
 
const share = req.body.share; // send true to create link, false to delete link
  if (share){
    // checking if link already exists
    await connectDB();  
    const existingLink = await LinkModel.findOne({
      userId: req.userId
    })
    if (existingLink) {
        res.json({
          message: "Link already exists",
          link: existingLink.hash 
        })
        return;
    }
    // link does not exist now:- creating new link
    const hash = random(10);
    const FrontendURL = "http://localhost:5173"
    const newLink = await LinkModel.create({
        hash: hash,
        userId: req.userId
    })
    res.json({
      message: "Link created",
      link: `${FrontendURL}/app/v1/brain/${newLink.hash}`
    })
  }else{
   await LinkModel.deleteOne({
    userId: req.userId
   })
   // link deleted
   res.json({
    message: "Link deleted"
   })
  }

})


app.get("/app/v1/brain/:sharelink", async(req,res)=>{
const sharelink = req.params.sharelink;
await connectDB();
const link = await LinkModel.findOne({
  hash: sharelink
})
// if link not found
if (!link) {
  res.status(404).json({
    message: "Link not found"
  })
  return;
} 
//  link found
const userId = link.userId;
const content = await ContentModel.find({
  userId
})//  no useful since give username for every content piece
// .populate("userId", "username")
const user = await UserModel.findById({
  _id: userId
}).select("username");
console.log("user is", user)

  if (!content) {
    res.status(404).json({
      message: "Content not found"
    })
    return;
  }
res.status(200).json({
    message: "Link found",
    content: content,
    loading: true,
    username: user?.username
  })
})


app.listen(3001,"0.0.0.0", () => {
  console.log('Server is running on http://localhost:3001');
});
