import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_DB_URI;

export async function connectDB() {
    if (!MONGO_URI) {
        throw new Error("Please define MONGODB_URI or MONGO_DB_URI inside .env");
    }

    try {
        const connection = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            dbName: "secondbrain",
        });

        console.log("connection successful.");
        return connection;
    } catch (error) {
        console.error("DB connection failed:", error);
        throw new Error("Failed to connect to db.");
    }
}