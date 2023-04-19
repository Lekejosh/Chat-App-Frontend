<template>
  <div v-if="chats.length">
    <div class="top"></div>
    <div class="box">
      <div class="left">
        <div class="topp">
          <h2>teamIt</h2>
        </div>
        <div class="search">
          <div class="ico">
            <ion-icon name="add-outline"></ion-icon>
          </div>
          <input type="text" class="in" placeholder="search for chats here" />
          <div class="ico">
            <img src="assets/img/search.svg" alt="" class="icon1" />
          </div>
        </div>
        <ul>
          <li v-for="chat in chats" :key="chat._id" @click="fetchMessage(chat._id)">
            <div class="friend">
              <div class="img_name">
                <template v-if="chat.chatName === 'sender'">

                  <img :src="chat.users[0].avatar.url" :alt="chat.users[0].username" class="ava" />
                  <div>
                    <h3>{{ chat.users[0].username }}</h3>
                    <p>{{ chat.latestMessage.content }}</p>
                  </div>

                </template>
                <template v-else>
                  <img :src="chat.groupAvatar.url" :alt="chat.chatName" class="ava" />
                  <div>
                    <h3>{{ chat.chatName }}</h3>
                    <p v-if="chat.latestMessage?.content">{{ chat.latestMessage.content }}</p>
                    <p v-else></p>
                  </div>
                </template>
              </div>
              <div class="time">
                <p class="p">{{ formatDate(chat.updatedAt) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="messages.length || chatUsers.length" class="right">
        <div class="right_top">
          <div v-if="chatUsers.chatName === 'sender'" class="img_name">
            <img :src="filterUserName[0].avatar.url" :alt="filterUserName[0].username" class="ava" />
            <div>
              <h3>{{ filterUserName[0].username }}</h3>
              <!-- <p>active 30 seconds ago...</p> -->
            </div>
          </div>
          <div v-else class="img_name">
            <img :src="chatUsers.groupAvatar.url" :alt="chatUsers.chatName" class="ava" />
            <div>
              <h3>{{ chatUsers.chatName }}</h3>
              <!-- <p>active 30 seconds ago...</p> -->
            </div>
          </div>
          <img src="assets/img/ellipsis.svg" alt="" class="icon2" />
        </div>
        <div class="mid">
          <template v-if="messages.length">
            <div v-for="message in messages" :key="message._id" :class="userId === message.sender._id ? 'me' : 'u'">
              <p>{{ message.content }}</p>
            </div>
          </template>
          <template v-else>
            <div>
              <p></p>
            </div>
          </template>
        </div>


        <div class="btm">
          <form @submit.prevent>
            <div>
              <ion-icon name="attach-outline" class="send_svg"></ion-icon>
            </div>
            <textarea @keydown.enter.prevent="sendMessage(chatId)" placeholder="Type your message here" class="in2"
              name="content" v-model="content"></textarea>

            <div class="ico3" @click="sendMessage(chatId)" :disabled="isFormIncomplete">
              <ion-icon name="send-outline" type="submit" class="send_svg"></ion-icon>

            </div>
          </form>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import axiosInstance from "@/axiosInterceptors";
import { ref, computed } from "vue";
import io from "socket.io-client";

export default {
  name: "UserView",

  data() {
    return {
      chats: [],
      displayUser: [],
      chatId: localStorage.getItem("chatId"),
      id: localStorage.getItem("userId"),
    };
  },

  setup() {
    const messages = ref([]);
    const chatUsers = ref([]);
    const content = ref("");
    const filterUserName = ref([]);
    const userId = localStorage.getItem("userId");
    const fetchMessage = async (chatId) => {
      localStorage.setItem("chatId", chatId);
      axiosInstance
        .get(`message/${chatId}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log("This are the messages: ", res.data);
          messages.value = res.data.messages;
          chatUsers.value = res.data.chat;
          const username = res.data.chat.users;
          filterUserName.value = username.filter((user) => user._id !== userId);
        });
    };

    const sendMessage = async (chatId) => {
      try {

        const response = await axiosInstance.post(
          "message",
          { content: content.value, chatId: chatId },
          { withCredentials: true }
        );
        content.value = ''
        console.log("Message sent:", response.data);

      } catch (error) {
        console.error("Error sending message:", error);
      }
    };
    const isFormIncomplete = computed(() => {
      return !content.value;
    });

    return {
      fetchMessage,
      userId,
      messages,
      content,
      chatUsers,
      filterUserName,
      sendMessage,
      isFormIncomplete,
    };
  },
  mounted() {
    const socket = io(process.env.VUE_APP_URL);
    socket.on("connection");
    axiosInstance
      .get(process.env.VUE_APP_BASE_URL + "chat/fetch", {
        withCredentials: true,
      })
      .then((res) => {

        // this.chats = res.data.data;
        const chatData = res.data.data;
        const idToRemove = this.id
        console.log(idToRemove)
        const result = chatData.map(results => {
          const withoutUser = results.users.filter(user => user._id !== idToRemove)
          return { ...results, users: withoutUser }
        });
        console.log(result)
        this.chats = result
      });
  },
  methods: {
    formatDate(date) {
      const now = new Date();
      const updatedAt = new Date(date);

      if (updatedAt.toDateString() === now.toDateString()) {
        // Chat message was updated today
        return `${updatedAt.getHours().toString().padStart(2, "0")}:${updatedAt
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      } else {
        // Chat message was updated on a different day
        return `${(updatedAt.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${updatedAt
            .getDate()
            .toString()
            .padStart(2, "0")} ${updatedAt
              .getHours()
              .toString()
              .padStart(2, "0")}:${updatedAt
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --grad: linear-gradient(to bottom right, #8bc34a #ff9800);
  --clip: polygon(52% 65%, 100% 38%, 100% 0, 0 0, 0% 38%);
  --shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px;
  --c: #eaeaea;
  --g: #74d800;
}

.top {
  height: 100vh;
  background-image: var(--grad) !important;
  width: 100%;
  clip-path: var(--clip) !important;
}

.box {
  width: 1000px;
  height: 600px;
  border-radius: 5px;
  box-shadow: var(--shadow);
  position: absolute;
  top: 50%;
  background: white;
  left: 50%;
  display: flex;
  transform: translate(-50%, -50%);
}

.left {
  width: 280px;
  height: 600px;
  border-right: 1px solid #eaeaea;
}

.right {
  height: 600px;
  width: calc(1000px - 280px);
}

.topp {
  width: 280px;
  height: 50px;
  display: flex;
  border-bottom: 1px solid #eaeaea;
  justify-content: space-around;
  align-items: center;
}

.search {
  width: 280px;
  height: 50px;
  display: flex;
  border-bottom: 1px solid #eaeaea;
  justify-content: space-around;
  align-items: center;
}

.ico {
  padding: 5px;
  border-radius: 5px;
}

.icon1 {
  width: 23px;
  height: 23px;
}

.in {
  border: none;
  outline: none;
  background: #eaeaea;
  padding: 10px 15px;
  border-radius: 5px;
  width: 250px;
}

.ava {
  height: 40px;
  width: 40px;
  margin-left: 7px;
  border-radius: 50px;
}

li {
  list-style: none;
}

.friend {
  display: flex;
  align-items: center;
  transition: 0.5s ease;
  height: 60px;
  border-bottom: 1px solid #eaeaea;
  justify-content: space-between;
}

.friend:hover {
  background: #eaeaea;
  cursor: pointer;
}

.friend:active {
  background: #eaeaea;
}

.img_name {
  display: flex;
  align-items: center;
}

h3 {
  font-size: 14px;
  margin-left: 7px;
}

p {
  margin-left: 7px;
  color: grey;
  font-size: 12px;
}

.p {
  margin-right: 10px;
}

ul {
  height: calc(600px - 100px);
  overflow-y: auto;
}

span {
  color: green;
}

.right_top {
  height: 50px;
  border-bottom: 1px solid #eaeaea;
  width: calc(1000px - 280px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon2 {
  margin-right: 20px;
  height: 23px;
  width: 23px;
}

.mid {
  overflow-y: auto;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  height: calc(600px - 100px);
}

.btm {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
}

form {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-radius: 5px;
  border: 1px solid lightgray;
}

.ico3,
form div {
  background: #eaeaea;
  padding: 10px;
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ico3,
form div:hover {
  background: green;
}

.send_svg {
  height: 23px;
  width: 23px;
}

.in2 {
  border: none;
  outline: none;
  background: transparent;
  width: 550px;
}

.me {
  margin: 10px;
  background: rgb(66, 194, 66);
  padding: 10px;
  display: table;
  clear: both;
  max-width: 80%;
  border-radius: 5px;
  float: right;
}

.u {
  margin: 10px;
  background: grey;
  padding: 10px;
  display: table;
  clear: both;
  max-width: 80%;
  border-radius: 5px;
  float: left;
}

.me p {
  color: white;
  font-size: 15px;
}

.u p {
  color: white;
  font-size: 15px;
}
</style>
