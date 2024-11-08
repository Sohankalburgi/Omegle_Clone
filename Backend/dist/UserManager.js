"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager();
    }
    addUser(name, socket) {
        this.users.push({
            name,
            socket
        });
        this.queue.push(socket.id);
        socket.emit("lobby");
        this.clearQueue();
        console.log('this is the init handlers methods exe');
        this.initHandlers(socket);
    }
    removeUser(socketId) {
        const user = this.users.find(({ socket }) => socket.id === socketId);
        this.users = this.users.filter(({ socket }) => socket.id !== socketId);
        this.queue = this.queue.filter((socket) => socket !== socketId);
    }
    clearQueue() {
        console.log(this.queue);
        console.log('the users list');
        console.log(this.users);
        if (this.queue.length < 2) {
            return;
        }
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        console.log("id1", id1);
        console.log("id2", id2);
        const user1 = this.users.find((x) => x.socket.id === id1);
        const user2 = this.users.find((x) => x.socket.id === id2);
        console.log("users");
        console.log(user1);
        console.log(user2);
        if (!user1 || !user2) {
            return;
        }
        console.log('creating rooms');
        const room = this.roomManager.createRooms(user1, user2);
        this.clearQueue();
    }
    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            console.log("under the offer of the offer in inithandler");
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            console.log("under the offer of the answer in inithandler");
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidate(roomId, socket.id, candidate, type);
        });
    }
}
exports.UserManager = UserManager;
