<script setup>
// eslint-disable-next-line
/* eslint-disable */
import axiosInstance from "@/axiosInterceptors";
import SocketioService from '@/services/socketio.service'
import { useStore } from 'vuex';
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import debounce from "lodash/debounce";
import io from "socket.io-client";
import CreateChat from '@/components/CreateChat.vue'


const store = useStore();
const messages = ref([]);
const chatUsers = ref([]);
const content = ref("");
const filterUserName = ref([]);
const selectedChat = ref(null);
const isTyping = ref(false);
const userId = localStorage.getItem("userId");
const socket = io(process.env.VUE_APP_URL);
const socketConnected = ref(false);
const chats = ref([]);
const typingChat = ref('')
const messageBox = ref(null);
const allUsers = ref([])
const search = ref('')
const filteredSearch = ref([...allUsers.value])
const create = ref(false)
const notifications = ref([])
const readArray = ref([])


watch(search, () => {
  filteredSearch.value = allUsers.value.filter(users => users.username.toLowerCase().includes(search.value.toLowerCase()))
})

watch(messages, (newValue, oldValue) => {
  fetchAllChat()
}, { deep: true });
const fetchAllChat = async () => {
  await axiosInstance
    .get("chat/fetch", {
      withCredentials: true,
    })
    .then((res) => {
      const chatData = res.data.data;
      const idToRemove = userId;
      const result = chatData.map(results => {
        const withoutUser = results.users.filter(user => user._id !== idToRemove);
        return { ...results, users: withoutUser };
      });
      chats.value = result
    });

}

const getNumNewNotifications = (chat) => {
  const matchingNotifications = computed(() =>
    notifications.value.filter(
      (notification) => notification.chat._id === chat
    )
  );
  return matchingNotifications.value.length;
};

const clearNotifications = (chat) => {
  readArray.value = notifications.value.filter((notification) => notification.chat._id === chat)
  notifications.value = notifications.value.filter(
    (notification) => notification.chat._id !== chat
  );
  readArray.value.forEach(data => {
    readMessage(data._id)
  });
};

const onKeyDown = (event) => {
  if (event.keyCode === 27 || (event.ctrlKey && event.keyCode === 90)) {
    messages.value = []
  }
};


const fetchMessage = async (chatId) => {
  await store.dispatch('setChatId', { chatId: chatId });
  await axiosInstance
    .get(`message/${chatId}`, {
      withCredentials: true,
    })
    .then((res) => {
      messages.value = res.data.messages;
      chatUsers.value = res.data.chat;
      const username = res.data.chat.users;
      filterUserName.value = username.filter((user) => user._id !== userId);
      SocketioService.joinChat(chatId)
      selectedChat.value = chatId
      clearNotifications(chatId)
    });
};

const sendMessage = async (chatId) => {
  try {
    const response = await axiosInstance.post(
      "message",
      { content: content.value, chatId: chatId },
      { withCredentials: true }
    );

    content.value = '';
    socket.emit('stop typing', selectedChat)
    isTyping.value = false
    SocketioService.newMessage(response.data)
    messages.value = [...messages.value, response.data];
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const readMessage = async (messageId) => {
  await axiosInstance.post(`message/read/${messageId}`, {}, { withCredentials: true })

}

const getAllUnReadMessage = async (chatId, userId) => {
  await axiosInstance.get(`message/${chatId}`, {
    withCredentials: true,
  }).then((res) => {
    const read = res.data.messages.filter((user) => !user.isReadBy.includes(userId));
    if (read.length > 0) {
      notifications.value = [...notifications.value, ...read];
    }
  });
}


const accessChat = async (userId) => {
  try {
    const response = await axiosInstance.post('chat', { userId: userId }, { withCredentials: true });
    fetchMessage(response.data._id)
  } catch (error) {
    console.error(error)
  }
}

const isFormIncomplete = computed(() => {
  return !content.value;
});

const formatDateInChat = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const updatedAt = new Date(date);
  const isThisYear = (updatedAt.getFullYear() === today.getFullYear());

  const options = {};


  if (updatedAt.toDateString() === today.toDateString()) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  else if (updatedAt.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  else {
    options.day = '2-digit';
    options.month = '2-digit';
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.year = isThisYear ? undefined : 'numeric';
  }

  const formatter = new Intl.DateTimeFormat('en-US', options);

  return formatter.format(updatedAt);
};

const formatDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const updatedAt = new Date(date);
  const isThisYear = (updatedAt.getFullYear() === today.getFullYear());

  const options = {};


  if (updatedAt.toDateString() === today.toDateString()) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  else if (updatedAt.toDateString() === yesterday.toDateString()) {
    return `Yesterday`;
  }

  else {
    options.day = '2-digit';
    options.month = '2-digit';
    options.year = isThisYear ? undefined : 'numeric';
  }

  const formatter = new Intl.DateTimeFormat('en-US', options);

  return formatter.format(updatedAt);
};




const typingHandler = () => {
  if (!socketConnected) return

  if (!isTyping.value) {
    socket.emit("typing", (selectedChat.value))
    typingChat.value = selectedChat.value
    debounceStopTyping()
  }
};

const debounceStopTyping = debounce(() => {
  socket.emit('stop typing', (selectedChat.value, filterUserName.value))
}, 3000)


onMounted(async () => {
  socketConnected.value = true;
  socket.emit('setup', userId);
  socket.on('typing', () => isTyping.value = true);
  socket.on('stop typing', () => isTyping.value = false);

  socket.on('message recieved', (newMessageReceived) => {
    if (!selectedChat.value || selectedChat.value !== newMessageReceived.chat._id) {
      if (!notifications.value.includes(newMessageReceived)) {
        notifications.value.push(newMessageReceived)
        fetchAllChat()
      }
    } else {
      messages.value = [...messages.value, newMessageReceived];
      readMessage(newMessageReceived._id)
    }
  });

  await axiosInstance
    .get("chat/fetch", {
      withCredentials: true,
    })
    .then((res) => {
      const chatData = res.data.data;
      const idToRemove = userId;
      const result = chatData.map(results => {
        const withoutUser = results.users.filter(user => user._id !== idToRemove);
        return { ...results, users: withoutUser };
      });
      chats.value = result
      result.forEach(data => {
        getAllUnReadMessage(data._id, idToRemove)
      })

    });


  await axiosInstance.get('user', { withCredentials: true }).then((res) => {
    allUsers.value = res.data.users
  })

  document.addEventListener('keydown', onKeyDown);
});


const scrollToBottom = () => {
  const el = messageBox.value;
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};


onBeforeUnmount(() => {
  SocketioService.disconnect();
  document.addEventListener('keydown', onKeyDown);
});
</script>

<template >
  <div v-if="chats.length">
    <div class="top"></div>
    <div class="box">
      <div class="left">
        <div class="topp">
          <h2>teamIt</h2>
        </div>
        <div class="search">
          <div class="ico" @click="create = true">
            <ion-icon name="add-outline"></ion-icon>
            <template v-if="create">
              <CreateChat />
            </template>

          </div>
          <input type="text" class="in" v-model.trim="search" placeholder="search for chats here" />
          <div class="ico">
            <img src="assets/img/search.svg" alt="" class="icon1" />
          </div>
        </div>
        <ul>
          <template v-if="search">
            <li v-for="allUser in filteredSearch" :key="allUser._id" @click="accessChat(allUser._id)">
              <div class="friend">
                <div class="img_name">


                  <img :src="allUser.avatar.url" :alt="allUser.username" class="ava" />
                  <div>
                    <h3>{{ allUser.username }}</h3>
                    <!-- <span v-if="isTyping">typing...</span> -->
                  </div>

                </div>
              </div>
            </li>
          </template>
          <template v-else>
            <li v-for="chat in chats" :key="chat._id" @click="fetchMessage(chat._id)">
              <div class="friend">
                <div class="img_name">
                  <template v-if="!chat.isGroupChat">

                    <img :src="chat.users[0].avatar.url" :alt="chat.users[0].username" class="ava" />
                    <div>
                      <h3>{{ chat.users[0].username }}</h3>
                      <!-- <span v-if="isTyping">typing...</span> -->


                      <template v-if="getNumNewNotifications(chat._id) > 0">
                        <p style="color: green;">{{ chat.latestMessage.content.message }} :{{
                          getNumNewNotifications(chat._id)
                        }}</p>

                      </template>
                      <template v-else>
                        <p>{{ chat.latestMessage.content.message }}</p>

                      </template>
                    </div>

                  </template>
                  <template v-else>
                    <img :src="chat.groupAvatar.url" :alt="chat.chatName" class="ava" />
                    <div>
                      <h3>{{ chat.chatName }}</h3>
                      <!-- <span v-if="isTyping">typing...</span> -->
                      <template v-if="getNumNewNotifications(chat._id) > 0">
                        <p v-if="chat.latestMessage.content.message && userId === chat.latestMessage?.sender._id">{{
                          chat.latestMessage.content.message }} </p>
                        <p v-else style="color: green;">{{ chat.latestMessage.sender.username }}: {{
                          chat.latestMessage.content.message }} :{{
    getNumNewNotifications(chat._id)
  }}
                        </p>
                      </template>
                      <template v-else>
                        <p v-if="chat.latestMessage.content.message && userId === chat.latestMessage?.sender._id">{{
                          chat.latestMessage.content.message }}</p>
                        <p v-else>{{ chat.latestMessage.sender.username }}: {{ chat.latestMessage.content.message }}</p>
                      </template>
                    </div>
                  </template>
                </div>
                <div class="time">
                  <p class="p">{{ formatDate(chat.updatedAt) }}</p>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div v-if="messages.length" class="right" v-bind:ref="messageBox">
        <div class="right_top">
          <div v-if="!chatUsers.isGroupChat" class="img_name">
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

          <template v-for="messagess in messages" :key="messagess._id">
            <div v-if="!chatUsers.isGroupChat"
              :class="[messagess.content.type === 'Group Activity' ? 'activity' : (userId === messagess.sender._id ? 'me' : 'u')]">
              <template v-if="messagess.content.type === 'Message'">
                <p>{{ messagess.content.message }}</p>
                <span>{{ formatDateInChat(messagess.createdAt) }}</span>
              </template>
              <template v-else>
                <p><i>{{ messagess.content.message }}</i></p>
              </template>

            </div>
            <div v-else
              :class="[messagess.content.type === 'Group Activity' ? 'activity' : (userId === messagess.sender._id ? 'me' : 'u')]">
              <template v-if="messagess.content.type === 'Message' && userId === messagess.sender._id">
                <p>{{
                  messagess.content.message }}</p>
                <span>{{ formatDateInChat(messagess.createdAt) }}</span>
              </template>
              <template v-else-if="messagess.content.type === 'Message'">
                <p>{{ messagess.sender.username }}: {{
                  messagess.content.message }}</p>
                <span>{{ formatDateInChat(messagess.createdAt) }}</span>
              </template>
              <template v-else>
                <p><i>{{ messagess.content.message }}</i></p>
              </template>

            </div>
          </template>
        </div>


        <div class="btm">
          <form @submit.prevent>
            <div>
              <ion-icon name="attach-outline" class="send_svg"></ion-icon>
            </div>
            <textarea @input="typingHandler" @keydown.enter.prevent="sendMessage(chatUsers._id)"
              placeholder="Type your message here" class="in2" name="content" v-model.trim="content"></textarea>
            <div class="ico3" @click="sendMessage(chatUsers._id)">
              <ion-icon name="send-outline" type="submit" class="send_svg" :disabled="isFormIncomplete"></ion-icon>

            </div>
          </form>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>




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
  max-height: 200px;
}

.message-input {
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  max-height: 200px;
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

.activity {
  margin: 10px auto;
  padding: 10px;
  display: table;
  clear: both;
  max-width: 80%;
  border-radius: 5px;
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

.me span {
  background: none;
  color: white;
  font-size: 14px;
}

.u span {
  background: none;
  color: white;
  font-size: 14px;
}

.activity p {
  color: black;
  font-size: 15px;
}
</style>
