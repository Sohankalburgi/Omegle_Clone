import { Socket } from "socket.io";
import express  from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { UserManager } from "./UserManager";
import mongoose from 'mongoose';

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

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Omg').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

io.on('connection', (socket:Socket) => {
  console.log('a user connected');
  userManager.addUser('randomname',socket, io); // Pass io to addUser
  socket.on('disconnect',()=>{
    console.log('user disconnected')
    userManager.removeUser(socket.id);
  })
});

server.listen(3000, '0.0.0.0',() => {
  console.log('server running at http://localhost:3000');
});