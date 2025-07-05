import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  socketId: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  socketId: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
