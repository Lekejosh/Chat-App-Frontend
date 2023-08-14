<template>
    <div class="left">
        <div class="topp">
            <div class="profile-icon">
                <img :src="profileImage" class="ava" @click="showProfile" />
                <template v-if="viewProfile">
                    <ProfilePage :avatar="me.avatar.url" :avatarOption="me.avatar.public_id" :status='me.status'
                        :username="me.username" :phoneNumber="me.mobileNumber" :emailAdrress="me.email" />
                </template>
            </div>
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
                                        <p
                                            v-if="chat.latestMessage.content.message && userId === chat.latestMessage?.sender._id">
                                            {{
                                                chat.latestMessage.content.message }} </p>
                                        <p v-else style="color: green;">{{ chat.latestMessage.sender.username }}: {{
                                            chat.latestMessage.content.message }} :{{
        getNumNewNotifications(chat._id)
    }}
                                        </p>
                                    </template>
                                    <template v-else>
                                        <p
                                            v-if="chat.latestMessage.content.message && userId === chat.latestMessage?.sender._id">
                                            {{
                                                chat.latestMessage.content.message }}</p>
                                        <p v-else>{{ chat.latestMessage.sender.username }}: {{
                                            chat.latestMessage.content.message }}</p>
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
</template>
<script setup>
import { ref } from "vue";

const chats = ref([]);



</script>