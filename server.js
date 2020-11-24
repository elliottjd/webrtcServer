
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
require("dotenv").config

const rooms = {};

io.on("connection", socket => {

    socket.on("join room", roomID => {

        if (rooms[roomID]) {

            rooms[roomID].push(socket.id);

        } 
        else {
            rooms[roomID] = [socket.id];
        }
        const altUsers = rooms[roomID].find(id => id !== socket.id);
        
        if (altUsers) {
            socket.emit("other user", altUsers);
            socket.to(altUsers).emit("user joined", socket.id);
        }
        
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});

if(process.env.PROD) {
    app.use(express.static(path.join(__dirname, './client/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.join(__dirname, './client/build/index.html'))
    });
}


const serverPort=process.env.PORT || 4000;
server.listen(serverPort, () => console.log(`Server Hosted on port ${serverPort}`));
