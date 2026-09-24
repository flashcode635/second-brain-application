import { type RequestHandler } from 'express';
import * as z from "zod";
import {connectDB } from './models/db.js';
import {UserModel} from './models/userSchema.js';
import { ContentModel } from './models/contentSchema.js';
import { random } from './utils.js';
import LinkModel from './models/linkSchema.js';
import { SettingsModel } from './models/settings.js';

export const pingHandler:RequestHandler = (req, res) => {
  // Returns instantly. No DB calls, no heavy logging.
  res.status(200).send('OK');
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