const socket = io.connect();
const messageContainer = document.getElementById("message-container");

var rooms = {};

socket.on("listRoom", (roomsData) => {
  if (JSON.stringify(rooms) === JSON.stringify(roomsData)) {
    return;
  }
  rooms = roomsData;
  console.log(rooms);
  messageContainer.innerHTML = "";
  for (i in rooms) {
    room = rooms[i];
    const messageElement = document.createElement("div");
    const link = document.createElement("a");
    link.href = "http://" + room.address + ":" + room.port;
    link.innerText = "Room " + room.address;
    messageElement.append(link);
    messageContainer.append(messageElement);
  }
});
