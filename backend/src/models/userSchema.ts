import mongoose,{ Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique:true },
  password: { type: String, required: true,unique:true },
});

export const UserModel = mongoose.model('users', userSchema);


