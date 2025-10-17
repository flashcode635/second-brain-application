import { Schema, model } from 'mongoose';

const tagSchema = new Schema({
 title: { type: String, required: true, unique: true }
});

const tag = model('tag', tagSchema);

export default tag;