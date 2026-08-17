import { Schema, model } from 'mongoose';

export interface ITag {
  title: string;
}

const tagSchema = new Schema<ITag>({
  title: { type: String, required: true, unique: true }
});

const tag = model<ITag>('tag', tagSchema);

export default tag;