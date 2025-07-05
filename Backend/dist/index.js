"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./UserManager");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const userManager = new UserManager_1.UserManager();
// Connect to MongoDB
mongoose_1.default.connect('mongodb://127.0.0.1:27017/Omg').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
io.on('connection', (socket) => {
    console.log('a user connected');
    userManager.addUser('randomname', socket, io); // Pass io to addUser
    socket.on('disconnect', () => {
        console.log('user disconnected');
        userManager.removeUser(socket.id);
    });
});
server.listen(3000, '0.0.0.0', () => {
    console.log('server running at http://localhost:3000');
});
