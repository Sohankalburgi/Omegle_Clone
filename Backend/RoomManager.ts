import { User } from "./UserManager";

let GLOBAL_ROOM_ID: number = 0;

interface Room {
  user1: User;
  user2: User;
}

export class RoomManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  createRooms(user1: User, user2: User) {
    const roomId = (GLOBAL_ROOM_ID++).toString();
    console.log("under the create room logic");
    this.rooms.set(roomId, {
      user1,
      user2,
    });
    

    user1.socket.emit("send-offer", {
      roomId
    });

    user2.socket.emit("send-offer",{
      roomId
    })

  }

  onOffer(roomId: string, sdp: string, senderSocketid:string) {
    console.log('On Offer');
    const room = this.rooms.get(roomId);

    if(!room) {return;}
    const receivingUser = room.user1.socket.id === senderSocketid ? room.user2:room.user1;

    receivingUser?.socket.emit("offer", {
      sdp,
      roomId,
    });
  }

  onAnswer(roomId: string, sdp: string, senderSocketid: string) {

    console.log('onAnswer');

    const room = this.rooms.get(roomId);

    if(!room) {return;}
    const receivingUser = room.user1.socket.id === senderSocketid ? room.user2:room.user1;

    receivingUser?.socket.emit("answer", {
      sdp,
      roomId,
    });
  }

  onIceCandidate(roomId: string, senderSocketid : string, candidate : any,type :"sender" | "receiver"){
    const room = this.rooms.get(roomId);

    if(!room){ return;}

    const receivingUser = room.user1.socket.id === senderSocketid ? room.user2:room.user1;

    receivingUser.socket.emit("add-ice-candidate",({candidate,type}) );
  }

}
