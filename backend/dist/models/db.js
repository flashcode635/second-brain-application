import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_DB_URI;
export async function connectDB() {
    if (!MONGO_URI) {
        throw new Error("Please define the MONGO_URI environment variable inside .env");
    }
    const connection = await mongoose.connect(MONGO_URI);
    if (!connection) {
        throw new Error(" Failed to connect to db.");
    }
    else {
        console.log("connection successful.");
    }
}
//# sourceMappingURL=db.js.map