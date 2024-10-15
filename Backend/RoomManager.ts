interface Room {
    user1 : string,
    user2 : string,
}

export class RoomManager{
    
    constructor(){
        this.rooms = new Map<string,Room>
    }
}