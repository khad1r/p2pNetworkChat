const PORT = 3333;
const BCAST_ADDR = "255.255.255.255";
const PORT_ROOM = 5550;
const dgram = require("dgram");
const broadcast = dgram.createSocket({ type: "udp4", reuseAddr: true });
broadcast.bind(PORT, function () {
  broadcast.setBroadcast(true);
  setInterval(broadcastNew, 5000);
});
function broadcastNew() {
  let bufferMsg = Buffer.from("" + PORT_ROOM);

  broadcast.send(bufferMsg, 0, bufferMsg.length, PORT, BCAST_ADDR, function () {
    console.log("Broadcast " + PORT_ROOM + " to port : " + PORT);
  });
}
