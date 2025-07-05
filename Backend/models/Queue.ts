import mongoose, { Document, Schema } from 'mongoose';

export interface IQueue extends Document {
    socketIds: string[];
}

const QueueSchema = new Schema<IQueue>({
    socketIds: [{ type: String, required: true }],
});

export const QueueModel = mongoose.model<IQueue>('Queue', QueueSchema);
