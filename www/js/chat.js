const socket = io.connect();
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const name = prompt("What is your name?");
appendMessage("You joined");
socket.emit("new-user", name);

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}\t: ${data.message}`);
});

socket.on("user-list", (users) => {
  document.getElementById("room-users").innerText =
    Object.keys(users).length + " users";
  document.getElementById("users").innerHTML = "";
  for (i in users) {
    user = users[i];
    const element = document.createElement("div");
    const userElement = document.createElement("span");
    if (i === socket.id) userElement.innerText = user + " [me]";
    else userElement.innerText = user;
    element.append(userElement);
    document.getElementById("users").append(element);
  }
  // delete data[id.id];
  // console.log(id.id);
  // console.log(data);
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You\t: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  window.scrollTo(0, document.body.scrollHeight);
}

document.getElementById("burger").addEventListener("click", () => {
  if (document.getElementById("room-info").style.display === "block") {
    document.getElementById("room-info").style.display = "none";
    return;
  }

  document.getElementById("room-info").style.display = "block";
});
