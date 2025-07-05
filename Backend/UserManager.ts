import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";
import { UserModel } from './models/User';
import { QueueModel } from './models/Queue';

export class UserManager{
    private roomManager : RoomManager;
    constructor(){
        this.roomManager = new RoomManager();
    }

    async addUser(name:string, socket:Socket, io: any){
        // Save user to DB
        const user = await UserModel.create({ name, socketId: socket.id });
        // Add to queue in DB
        let queue = await QueueModel.findOne();
        if (!queue) {
            queue = await QueueModel.create({ socketIds: [socket.id] });
        } else {
            queue.socketIds.push(socket.id);
            await queue.save();
        }
        socket.emit("lobby");
        await this.clearQueue(io);
        this.initHandlers(socket, io);
    }

    async removeUser(socketId : string){
        // Remove from queue in DB
        let queue = await QueueModel.findOne();
        if (queue) {
            queue.socketIds = queue.socketIds.filter(id => id !== socketId);
            await queue.save();
        }
        // Optionally remove user from DB (if you want to keep, comment this out)
        // await UserModel.deleteOne({ socketId });
    }

    async clearQueue(io: any){
        let queue = await QueueModel.findOne();
        if (!queue || queue.socketIds.length < 2) return;
        const id1 = queue.socketIds.shift();
        const id2 = queue.socketIds.shift();
        await queue.save();
        const user1 = await UserModel.findOne({ socketId: id1 });
        const user2 = await UserModel.findOne({ socketId: id2 });
        if(!user1 || !user2) return;
        await this.roomManager.createRooms(user1, user2, io);
        await this.clearQueue(io);
    }

    initHandlers(socket:Socket, io: any){
        socket.on("offer", ({sdp,roomId}:{sdp: string,roomId: string})=>{
            this.roomManager.onOffer(roomId,sdp,socket.id, io);
        }); 
        socket.on("answer",({sdp,roomId}:{sdp: string, roomId: string})=>{
            this.roomManager.onAnswer(roomId,sdp,socket.id, io);
        });
        socket.on("add-ice-candidate",({candidate, roomId, type})=>{
            this.roomManager.onIceCandidate(roomId,socket.id,candidate,type, io);
        });
    }
}