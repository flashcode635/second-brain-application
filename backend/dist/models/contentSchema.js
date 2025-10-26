import mongoose, { Document, Model } from "mongoose";
const { Schema } = mongoose;
const contentTypes = ["twitter", "youtube", "linkedIn"]; // Make it  for type safety
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});
// Create the model with proper types
export const ContentModel = mongoose.models?.content ||
    mongoose.model("content", contentSchema);
//# sourceMappingURL=contentSchema.js.map