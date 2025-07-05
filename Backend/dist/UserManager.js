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
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
const User_1 = require("./models/User");
const Queue_1 = require("./models/Queue");
class UserManager {
    constructor() {
        this.roomManager = new RoomManager_1.RoomManager();
    }
    addUser(name, socket, io) {
        return __awaiter(this, void 0, void 0, function* () {
            // Save user to DB
            const user = yield User_1.UserModel.create({ name, socketId: socket.id });
            // Add to queue in DB
            let queue = yield Queue_1.QueueModel.findOne();
            if (!queue) {
                queue = yield Queue_1.QueueModel.create({ socketIds: [socket.id] });
            }
            else {
                queue.socketIds.push(socket.id);
                yield queue.save();
            }
            socket.emit("lobby");
            yield this.clearQueue(io);
            this.initHandlers(socket, io);
        });
    }
    removeUser(socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove from queue in DB
            let queue = yield Queue_1.QueueModel.findOne();
            if (queue) {
                queue.socketIds = queue.socketIds.filter(id => id !== socketId);
                yield queue.save();
            }
            // Optionally remove user from DB (if you want to keep, comment this out)
            // await UserModel.deleteOne({ socketId });
        });
    }
    clearQueue(io) {
        return __awaiter(this, void 0, void 0, function* () {
            let queue = yield Queue_1.QueueModel.findOne();
            if (!queue || queue.socketIds.length < 2)
                return;
            const id1 = queue.socketIds.shift();
            const id2 = queue.socketIds.shift();
            yield queue.save();
            const user1 = yield User_1.UserModel.findOne({ socketId: id1 });
            const user2 = yield User_1.UserModel.findOne({ socketId: id2 });
            if (!user1 || !user2)
                return;
            yield this.roomManager.createRooms(user1, user2, io);
            yield this.clearQueue(io);
        });
    }
    initHandlers(socket, io) {
        socket.on("offer", ({ sdp, roomId }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id, io);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id, io);
        });
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidate(roomId, socket.id, candidate, type, io);
        });
    }
}
exports.UserManager = UserManager;
