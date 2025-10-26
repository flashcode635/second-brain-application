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
      res.json({
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
      res.status(401).json({
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
   res.status(401).json(
     {      
       message: "use not found, plz sign up",
     }
   )
 } else {
  const token = jwt.sign({
    id: existingUser._id
  }, jwt_password)
     res.status(200).json({
       message:"logging in....",
      token: token,
      id: existingUser._id
     })
 }
   } catch (error) {
    res.json({
       message:" user login failed!",

    })
   }

})


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
        tags: []
    })

    res.json({
        message: "Content added",
        content: newContent
    })
    
})

app.get("/app/v1/content", userMiddleware,async(req,res)=>{
  
   const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})
app.delete("/app/v1/content", userMiddleware,async(req,res)=>{
   
    const contentId = req.body.contentId;
    await connectDB();

    const deletedContent = await ContentModel.deleteMany(
      { 
       contentId,
      userId: req.userId,
      }
    );
    if (!deletedContent) {
      res.json({
        message: "Content not found"
      })
    }else{
      res.json({
        message: "Content deleted"
      })
    }
})
app.post("/app/v1/brain/share", userMiddleware,async(req,res)=>{
 
  const share = req.body.share;
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
    const newLink = await LinkModel.create({
        hash: hash,
        userId: req.userId
    })
    res.json({
      message: "Link created",
      link: "/share/" + newLink.hash
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
}).populate("userId", "username")
  if (!content) {
    res.status(404).json({
      message: "Content not found"
    })
    return;
  }
res.status(200).json({
    message: "Link found",
    content: content
  })
})


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
