import { IUser, UserModel } from './models/User';
import { RoomModel } from './models/Room';
import { Types } from 'mongoose';

let GLOBAL_ROOM_ID: number = Math.ceil(Math.random()*100 + Math.random() *100)

export class RoomManager {
  constructor() { }

  async createRooms(user1: IUser, user2: IUser, io: any) {
    const roomId = (GLOBAL_ROOM_ID++).toString();
    await RoomModel.create({
      user1: user1._id,
      user2: user2._id,
      roomId,
    });
    io.to(user1.socketId).emit("send-offer", { roomId });
    io.to(user2.socketId).emit("send-offer", { roomId });
  }

  async onOffer(roomId: string, sdp: string, senderSocketid: string, io: any) {
    const room = await RoomModel.findOne({ roomId }).populate('user1').populate('user2');
    if (!room) return;
    const user1 = await UserModel.findById(room.user1);
    const user2 = await UserModel.findById(room.user2);
    const receivingUser = user1?.socketId === senderSocketid ? user2 : user1;
    if (receivingUser && receivingUser.socketId) {
      io.to(receivingUser.socketId).emit("offer", { sdp, roomId });
    }
  }

  async onAnswer(roomId: string, sdp: string, senderSocketid: string, io: any) {
    const room = await RoomModel.findOne({ roomId }).populate('user1').populate('user2');
    if (!room) return;
    const user1 = await UserModel.findById(room.user1);
    const user2 = await UserModel.findById(room.user2);
    const receivingUser = user1?.socketId === senderSocketid ? user2 : user1;
    if (receivingUser && receivingUser.socketId) {
      io.to(receivingUser.socketId).emit("answer", { sdp, roomId });
    }
  }

  async onIceCandidate(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver", io: any) {
    const room = await RoomModel.findOne({ roomId }).populate('user1').populate('user2');
    if (!room) return;
    const user1 = await UserModel.findById(room.user1);
    const user2 = await UserModel.findById(room.user2);
    const receivingUser = user1?.socketId === senderSocketid ? user2 : user1;
    if (receivingUser && receivingUser.socketId) {
      io.to(receivingUser.socketId).emit("add-ice-candidate", { candidate, type });
    }
  }
}
