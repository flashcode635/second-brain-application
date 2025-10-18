import mongoose, { Document, Model } from "mongoose";
const { Schema } = mongoose;

const contentTypes = ['image', 'video', 'article', 'audio'] as const; // Make it a const assertion for type safety

// Define the interface for the document
export interface IContent extends Document {
  link: string;
  type: typeof contentTypes[number];
  title: string;
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
}

const contentSchema = new Schema<IContent>({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

// Create the model with proper types
export const ContentModel: Model<IContent> = 
  mongoose.models?.content as Model<IContent> || 
  mongoose.model<IContent>("content", contentSchema);