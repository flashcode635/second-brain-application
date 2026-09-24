import mongoose, { Document, Model } from "mongoose";
const { Schema } = mongoose;

const contentTypes = ["twitter", "youtube", "linkedIn", "instagram", "reddit", "document"] as const;

// Define the interface for the document
export interface IContent extends Document {
  link: string;
  type: typeof contentTypes[number];
  title: string;
  description?: string;
  tags: string[]; // changed from mongoose.Types.ObjectId[] to string[]
  userId: mongoose.Types.ObjectId;
}

const contentSchema = new Schema<IContent>({
  link: { type: String, required: true , unique: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true  },
  description: { type: String, required: false },
   tags: [{
        type: String  // Changed from ObjectId to String
    }],
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

// Create the model with proper types
export const ContentModel: Model<IContent> = 
  mongoose.models?.content as Model<IContent> || 
  mongoose.model<IContent>("content", contentSchema);
  