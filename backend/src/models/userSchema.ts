import mongoose, { Schema } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

export const UserModel = mongoose.model<IUser>('users', userSchema);


