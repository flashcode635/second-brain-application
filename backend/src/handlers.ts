import { type RequestHandler } from 'express';
import * as z from "zod";
import {connectDB } from './models/db.js';
import {UserModel} from './models/userSchema.js';
import { ContentModel } from './models/contentSchema.js';
import { userMiddleware} from './midlleware.js';
import { random, signAccessToken, signRefreshToken, verifyRefreshToken } from './utils.js';
import LinkModel from './models/linkSchema.js';
import { RefreshTokenModel } from './models/refreshTokenSchema.js';
import { clearAuthCookies, setAuthCookies, setCsrfCookie } from './authCookies.js';
import { SettingsModel } from './models/settings.js';


const UserObject= z.object({
  username: z.string()
             .min(3, { message: "Too short username" })
             .max(10, { message: "Username is Longer than expected " }),
  password: z.string()
             .min(3,{ message: "Too short password" })
             .max(12,{ message: "password is Longer than expected " })
})

export const pingHandler:RequestHandler = (req, res) => {
  // Returns instantly. No DB calls, no heavy logging.
  res.status(200).send('OK');
}

export const SignUpHandler: RequestHandler = async(req, res) => {

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
}

export const SignInHandler: RequestHandler = async(req,res)=>{
   try {
     const { username, password } = UserObject.parse(req.body);
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
  const accessToken = signAccessToken({ id: existingUser._id.toString() });
  const refresh = signRefreshToken({ id: existingUser._id.toString() });
  await RefreshTokenModel.create({
    jti: refresh.jti,
    userId: existingUser._id,
    expiresAt: refresh.expiresAt,
  });
  setAuthCookies(res, accessToken, refresh.token);
  setCsrfCookie(res);
     return res.status(200).json({
       message:"logging in....",
       redirectTo: "/dashboard",
      user: { id: existingUser._id, username: existingUser.username }
     })
 }
   } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
       message:"user login failed!",
    })
   }

}

export const CreateContentHandler: RequestHandler = async(req,res)=>{
 const link = req.body.link;
    const type = req.body.type;
    await connectDB();
    // @ts-ignore
  const newContent= await ContentModel.create({
      link:link,
      type:type,
      title: req.body.title,
      description: req.body.description,
      userId: req.userId,
      tags: Array.isArray(req.body.tags) ? req.body.tags : []
   })

    res.json({
        message: "Content added",
        content: newContent
    })
    
}

export const FindContentHandler: RequestHandler = async(req,res)=>{
   await connectDB();   
   const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
}

export const UpdateContentHandler: RequestHandler = async(req,res)=>{
    try {
      const { id, title, link, type, description, tags } = req.body;
      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({ message: "id is required" });
      }

      await connectDB();

      const update: Record<string, unknown> = {};
      if (typeof title === "string") update.title = title;
      if (typeof link === "string") update.link = link;
      if (typeof type === "string") update.type = type;
      if (typeof description === "string") update.description = description;
      if (Array.isArray(tags)) update.tags = tags;

      const updated = await ContentModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        update,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Content not found" });
      }

      return res.status(200).json({
        message: "Content updated",
        content: updated,
      });
    } catch (error) {
      console.error("Update content error:", error);
      return res.status(500).json({ message: "Failed to update content" });
    }
}

export const DeleteContentHandler: RequestHandler = async(req,res)=>{
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
}

  export const RefreshHandler: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
   if (typeof refreshToken !== "string") {
    // Nothing was ever set thus no churn out clearCookie headers for no reason.
    return res.status(401).json({ message: "Refresh token is required" });
  }

    try {
      await connectDB();
      const payload = verifyRefreshToken(refreshToken);
      const jti = payload.jti;
      const userId = payload.id;
      if (!jti || !userId) throw new Error("Invalid refresh token payload");

      const storedToken = await RefreshTokenModel.findOne({ jti });
      if (!storedToken) {
        clearAuthCookies(res);
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      if (storedToken.revoked) {
        await RefreshTokenModel.updateMany({ userId: storedToken.userId }, { revoked: true });
        clearAuthCookies(res);
        return res.status(401).json({ message: "Refresh token reuse detected" });
      }

      if (storedToken.expiresAt.getTime() <= Date.now()) {
        clearAuthCookies(res);
        return res.status(401).json({ message: "Refresh token expired" });
      }

      const nextRefresh = signRefreshToken({ id: String(userId) });
      storedToken.revoked = true;
      await storedToken.save();
      await RefreshTokenModel.create({
        jti: nextRefresh.jti,
        userId: storedToken.userId,
        expiresAt: nextRefresh.expiresAt,
      });
      setAuthCookies(res, signAccessToken({ id: String(userId) }), nextRefresh.token);
      setCsrfCookie(res);
      return res.status(200).json({ message: "Session refreshed" });
    } catch {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  };

  export const LogoutHandler: RequestHandler = async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (typeof refreshToken === "string") {
        const payload = verifyRefreshToken(refreshToken);
        if (payload.jti) {
          await connectDB();
          await RefreshTokenModel.updateOne({ jti: payload.jti }, { revoked: true });
        }
      }
    } catch {
      // Logout remains idempotent even if the cookie is already invalid.
    }
    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out" });
  };

  export const MeHandler: RequestHandler = async (req, res) => {
    if (!req.userId) return res.status(401).json({ message: "You are not logged in" });
    await connectDB();
    const user = await UserModel.findById(req.userId).select("_id username");
    if (!user) return res.status(401).json({ message: "User not found" });
    return res.status(200).json({ user: { id: user._id, username: user.username } });
  };

  const UsernameUpdate = z.object({
    username: z.string()
      .min(3, { message: "Too short username" })
      .max(10, { message: "Username is Longer than expected " }),
  });

  export const UpdateUsernameHandler: RequestHandler = async (req, res) => {
    if (!req.userId) return res.status(401).json({ message: "You are not logged in" });
    try {
      const { username } = UsernameUpdate.parse(req.body);
      await connectDB();

      const updated = await UserModel.findByIdAndUpdate(
        req.userId,
        { username },
        { new: true }
      ).select("_id username");

      if (!updated) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({
        message: "Username updated",
        user: { id: updated._id, username: updated.username },
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        return res.status(409).json({ message: "That username is already taken" });
      }
      console.error("Update username error:", error);
      return res.status(400).json({ message: "Failed to update username" });
    }
  };

  export const GetSettingsHandler: RequestHandler = async (req, res) => {
    if (!req.userId) return res.status(401).json({ message: "You are not logged in" });
    await connectDB();
    const settings = await SettingsModel.findOne({ userId: req.userId });
    return res.status(200).json({ theme: settings?.theme ?? "light" });
  };

  const SettingsUpdate = z.object({
    theme: z.enum(["light", "dark"]),
  });

  export const UpdateSettingsHandler: RequestHandler = async (req, res) => {
    if (!req.userId) return res.status(401).json({ message: "You are not logged in" });
    try {
      const { theme } = SettingsUpdate.parse(req.body);
      await connectDB();
      const settings = await SettingsModel.findOneAndUpdate(
        { userId: req.userId },
        { theme },
        { upsert: true, new: true }
      );
      return res.status(200).json({ theme: settings.theme });
    } catch (error) {
      console.error("Update settings error:", error);
      return res.status(400).json({ message: "Failed to update settings" });
    }
  };

// linkedin Preview Specific API Endpint
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
export const LinkedInHandler: RequestHandler = async (req, res) => {
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
}

export const ShareBrainHandler: RequestHandler = async(req,res)=>{
 
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

}

export const ViewSharedBrainHandler: RequestHandler = async(req,res)=>{
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
}