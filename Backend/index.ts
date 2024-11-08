import { Socket } from "socket.io";
import express  from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { UserManager } from "./UserManager";

const app = express();
const server = createServer(app);
const io = new Server(server,
  {
    cors:{
      origin : "*"
    }
  }
);
const userManager = new UserManager();


io.on('connection', (socket:Socket) => {
  console.log('a user connected');
  userManager.addUser('randomname',socket);
  socket.on('disconnect',()=>{
    console.log('user disconnected')
    userManager.removeUser(socket.id);
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});