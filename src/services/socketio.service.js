import { io } from "socket.io-client";

class Socketioservice {
  socket;

  constructor() {}

  async setupSocketConnection() {
    this.socket = await io(process.env.VUE_APP_URL);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  async joinChat(chat) {
    await this.setupSocketConnection();
    this.socket.emit("join chat", chat);
  }

  newMessage(data) {
    this.socket.emit("new message", data);
  }

  async messageReceived(callback) {
    await this.setupSocketConnection();
    this.socket.on("message received", (newMessageReceived) => {
      console.log(newMessageReceived);
      callback(newMessageReceived);
    });
  }
}

export default new Socketioservice();
