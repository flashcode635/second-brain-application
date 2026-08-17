import mongoose from "mongoose";

export interface ILink {
  hash: string;
  userId: mongoose.Types.ObjectId;
}

// sharable link of brain - not users link!!
const linkSchema = new mongoose.Schema<ILink>({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, {
  timestamps: true
});

const LinkModel = mongoose.model<ILink>('Link', linkSchema);

export default LinkModel;
