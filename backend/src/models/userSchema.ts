import mongoose, { Schema } from 'mongoose';

// Shape of the "users" collection as written by better-auth (see ../auth.ts).
// Read-only from here on — user documents are created/updated by better-auth,
// this model exists so the rest of the app can populate/query them.
export interface IUser {
  name?: string;
  email?: string;
  username?: string;
  displayUsername?: string;
  image?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String },
  username: { type: String },
  displayUsername: { type: String },
  image: { type: String },
}, { collection: "users", strict: false });

export const UserModel = mongoose.model<IUser>('users', userSchema);


