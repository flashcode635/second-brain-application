import express from 'express';
import * as z from "zod";
import jwt from "jsonwebtoken";
import { connectDB } from './models/db.js';
import { UserModel } from './models/userSchema.js';
import { ContentModel } from './models/contentSchema.js';
import { userMiddleware } from './midlleware.js';
import { jwt_password } from './config.js';
const app = express();
app.use(express.json());
if (!jwt_password) {
    throw new Error("JWT_PASSWORD is not set in environment variables");
}
const UserObject = z.object({
    username: z.string()
        .min(3, { message: "Too short username" })
        .max(10, { message: "Username is Longer than expected " }),
    password: z.string()
        .min(3, { message: "Too short password" })
        .max(12, { message: "password is Longer than expected " })
});
app.post('/app/v1/signup', async (req, res) => {
    try {
        const { username, password } = UserObject.parse(req.body);
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        await connectDB();
        const existingUser = await UserModel.findOne({
            username: username,
            password: password,
        });
        //  checking existing user
        if (existingUser) {
            res.json({
                message: "user exist please sign in",
            });
        }
        const newUser = await UserModel.create({
            username: username,
            password: password,
        });
        res.status(201).json({
            message: 'User registered success',
            id: newUser._id
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
app.post("/app/v1/signin", async (req, res) => {
    const { username, password } = UserObject.parse(req.body);
    if (!username || !password) {
        res.status(401).json({
            message: "enter credentials properly",
        });
    }
    try {
        await connectDB();
        const existingUser = await UserModel.findOne({
            username: username,
            password: password
        });
        if (!existingUser) {
            res.status(401).json({
                message: "use not found, plz sign up",
            });
        }
        else {
            const token = jwt.sign({
                id: existingUser._id
            }, jwt_password);
            res.status(200).json({
                message: "logging in....",
                token: token,
                id: existingUser._id
            });
        }
    }
    catch (error) {
        res.json({
            message: " user login failed!",
        });
    }
});
app.post("/app/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await connectDB();
    // @ts-ignore
    const newContent = await ContentModel.create({
        link: link,
        type: type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content added",
        content: newContent
    });
});
app.get("/app/v1/content", userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.post("/app/v1/brain/share", async (req, res) => {
});
app.post("/app/v1/brain/:sharelink", async (req, res) => {
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
//# sourceMappingURL=index.js.map