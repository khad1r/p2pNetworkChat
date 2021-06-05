//server event

const express = require("express");
const ChatApp = express();
const server = require("http").createServer(ChatApp);
const dgram = require("dgram");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const BCAST_PORT = 3333;
const BCAST_ADDR = "255.255.255.255";
const PORT = 3030;
const users = {};
const rooms = {};
let serving = false;
let RoomName = "";
let broadcast = null;
let receiver = null;

ChatApp.use("/", express.static(__dirname + "/views/"));
server.listen(PORT);
ChatApp.use("/room", express.static(__dirname + "/views/404.html"));

function startServer() {
  broadcast = dgram.createSocket({ type: "udp4", reuseAddr: true });
  broadcast.bind(BCAST_PORT, function () {
    broadcast.setBroadcast(true);
    setInterval(broadcastNew, 5000);
  });
  serving = true;
}
function stopServer() {
  broadcast.close();
  chat_server.close();
  serving = false;
  console.log("server closed");
}
function startreceiving() {
  receiver = dgram.createSocket({ type: "udp4", reuseAddr: true });
  receiver.on("listening", function () {
    var address = receiver.address();
    console.log(
      "UDP Client listening on " + address.address + ":" + address.port
    );
    receiver.setBroadcast(true);
  });

  receiver.on("message", function (message, rinfo) {
    var temp_rooms = { ...rooms };
    rooms[rinfo.address] = {
      address: rinfo.address,
      port: message.toString(),
    };
    if (!(JSON.stringify(rooms) === JSON.stringify(temp_rooms))) {
      console.log(
        "New Room : " + rinfo.address + ":" + rinfo.port + " - " + message
      );
    }
    io.emit("listRoom", rooms);
  });
  receiver.bind(PORT);
}
function stopreceiving() {
  receiver.close();
  console.log("stop receiving");
}

function broadcastNew() {
  let bufferMsg = Buffer.from("" + PORT);

  broadcast.send(
    bufferMsg,
    0,
    bufferMsg.length,
    BCAST_PORT,
    BCAST_ADDR,
    function () {
      console.log("Broadcast " + PORT + " to port : " + BCAST_PORT);
    }
  );
}
startreceiving();
io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
    io.emit("user-list", users);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
    io.emit("user-list", users);
  });
});

// client Event
