"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const app = express();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('a user connected');
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
