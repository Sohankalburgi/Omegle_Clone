import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRoom extends Document {
    user1: Types.ObjectId;
    user2: Types.ObjectId;
    roomId: string;
}

const RoomSchema = new Schema<IRoom>({
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: String, required: true, unique: true },
});

export const RoomModel = mongoose.model<IRoom>('Room', RoomSchema);
