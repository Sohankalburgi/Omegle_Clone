"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 0;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRooms(user1, user2) {
        const roomId = (GLOBAL_ROOM_ID++).toString();
        console.log("under the create room logic");
        this.rooms.set(roomId, {
            user1,
            user2,
        });
        user1.socket.emit("send-offer", {
            roomId
        });
        user2.socket.emit("send-offer", {
            roomId
        });
    }
    onOffer(roomId, sdp, senderSocketid) {
        console.log('On Offer');
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("offer", {
            sdp,
            roomId,
        });
    }
    onAnswer(roomId, sdp, senderSocketid) {
        console.log('onAnswer');
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("answer", {
            sdp,
            roomId,
        });
    }
    onIceCandidate(roomId, senderSocketid, candidate, type) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser.socket.emit("add-ice-candidate", ({ candidate, type }));
    }
}
exports.RoomManager = RoomManager;
