"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const User_1 = require("./models/User");
const Room_1 = require("./models/Room");
let GLOBAL_ROOM_ID = Math.ceil(Math.random() * 100 + Math.random() * 100);
class RoomManager {
    constructor() { }
    createRooms(user1, user2, io) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = (GLOBAL_ROOM_ID++).toString();
            yield Room_1.RoomModel.create({
                user1: user1._id,
                user2: user2._id,
                roomId,
            });
            io.to(user1.socketId).emit("send-offer", { roomId });
            io.to(user2.socketId).emit("send-offer", { roomId });
        });
    }
    onOffer(roomId, sdp, senderSocketid, io) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield Room_1.RoomModel.findOne({ roomId }).populate('user1').populate('user2');
            if (!room)
                return;
            const user1 = yield User_1.UserModel.findById(room.user1);
            const user2 = yield User_1.UserModel.findById(room.user2);
            const receivingUser = (user1 === null || user1 === void 0 ? void 0 : user1.socketId) === senderSocketid ? user2 : user1;
            if (receivingUser && receivingUser.socketId) {
                io.to(receivingUser.socketId).emit("offer", { sdp, roomId });
            }
        });
    }
    onAnswer(roomId, sdp, senderSocketid, io) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield Room_1.RoomModel.findOne({ roomId }).populate('user1').populate('user2');
            if (!room)
                return;
            const user1 = yield User_1.UserModel.findById(room.user1);
            const user2 = yield User_1.UserModel.findById(room.user2);
            const receivingUser = (user1 === null || user1 === void 0 ? void 0 : user1.socketId) === senderSocketid ? user2 : user1;
            if (receivingUser && receivingUser.socketId) {
                io.to(receivingUser.socketId).emit("answer", { sdp, roomId });
            }
        });
    }
    onIceCandidate(roomId, senderSocketid, candidate, type, io) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield Room_1.RoomModel.findOne({ roomId }).populate('user1').populate('user2');
            if (!room)
                return;
            const user1 = yield User_1.UserModel.findById(room.user1);
            const user2 = yield User_1.UserModel.findById(room.user2);
            const receivingUser = (user1 === null || user1 === void 0 ? void 0 : user1.socketId) === senderSocketid ? user2 : user1;
            if (receivingUser && receivingUser.socketId) {
                io.to(receivingUser.socketId).emit("add-ice-candidate", { candidate, type });
            }
        });
    }
}
exports.RoomManager = RoomManager;
