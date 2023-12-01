import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5500;

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const io = new SocketServer(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
    socket.on("newuser", (username) => {
        socket.broadcast.emit("update", username );
        console.log(username)
    });

    socket.on("exituser", (username) => {
        socket.broadcast.emit("exit", username);
        console.log(username)

    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
        console.log(message)

    });

});

server.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
});
