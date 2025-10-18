import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_DB_URI ;


 export async function connectDB() {
    if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}     
const timeout = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("DB connection taking too long")), 5000);
    });
    const connection = await Promise.race([
        mongoose.connect(MONGO_URI),
        timeout
    ]);
        if(!connection){
            throw new Error(" Failed to connect to db.");
        }else{
            console.log("connection successful.");
        }
}