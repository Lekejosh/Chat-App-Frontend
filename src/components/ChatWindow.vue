<template>
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
            <div class="dropdown">
                <img src="assets/img/ellipsis.svg" style="cursor:pointer" class="icon2" @click="toggleDropdown" />
                <ul v-if="showDropdown">
                    <li v-if="!chatUsers.isGroupChat"> <template v-if="chatUsers.workspace.length">Open Workspace</template>
                        <template v-else>Create Private Workspace</template>
                    </li>
                    <li v-if="!chatUsers.isGroupChat">View User Info</li>
                    <li v-if="chatUsers.isGroupChat" @click="toggleGroupInfo">View Group Info</li>
                    <router-link to="/call/jecejcnecec/cemcoemceomc">
                        <li @click="setCallType">Make Call</li>
                    </router-link>


                    <li v-if="chatUsers.isGroupChat" @click="openPopup">
                        <template v-if="chatUsers.workspace.length">Open Workspace</template>
                        <template v-else>Create Workspace</template>
                    </li>
                    <li v-if="chatUsers.isGroupChat" @click="openPopup2">Add User</li>
                </ul>
            </div>

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
                    <ion-icon name="attach-outline" class="send_svg" @click="openFileExplorer"></ion-icon>
                </div>
                <textarea @input="typingHandler" @keydown.enter.prevent="sendMessage(chatUsers._id)"
                    placeholder="Type your message here" class="in2" name="content" v-model.trim="content"></textarea>
                <div class="ico3" @click="sendMessage(chatUsers._id)">
                    <ion-icon name="send-outline" type="submit" class="send_svg" :disabled="isFormIncomplete"></ion-icon>

                </div>
            </form>
        </div>
        <div class="popup-overlay" v-if="showPopup">
            <div class="popup">
                <h2>Enter Workspace Name</h2>
                <input type="text" v-model="workspaceName" placeholder="Workspace Name" />
                <button @click="createBoard(chatUsers._id)">Create</button>
                <button @click="showPopup = false">Cancel</button>
            </div>
        </div>
        <div class="popup-overlay" v-if="showPopupGroup">
            <div class="popup">
                <h2>Edit Group Name</h2>
                <input type="text" v-model="groupName" />
                <button @click="editGroup(chatUsers._id)">Done</button>
                <button @click="showPopupGroup = false">Cancel</button>
            </div>
        </div>
        <div class="popup-overlay" v-if="showPopupAddAdmin">
            <div class="popup">
                <h2>Add Amin</h2>
                <ul>

                    <li v-for="allUser in chatUsers.users" :key="allUser._id" @click="selectedAdmin(allUser._id)">
                        <div class="friend">
                            <div class="img_name">
                                <div>
                                    <h3>{{ allUser.username }}</h3>

                                </div>

                            </div>
                        </div>
                    </li>
                </ul>
                <button @click="makeAdmin(chatUsers._id)">Make Admin</button>
                <button @click="closeAddAdminPopup">Cancel</button>
            </div>
        </div>
        <div class="popup-overlay" v-if="showPopup2">
            <div class="popup">
                <h2>Add New User</h2>
                <input type="text" v-model="addUserSearch" placeholder="Search User By Username" />
                <button @click="addUser(chatUsers._id)">Add</button>
                <button @click="cancelPopup2">Cancel</button>
                <template v-if="addUserSearch">
                    <ul>

                        <li v-for="allUser in filteredAddUserSearch" :key="allUser._id" @click="selected(allUser._id)"
                            :style="{ backgroundColor: isInGroup(allUser._id) ? 'darkgrey' : '' }">
                            <div class="friend">
                                <div class="img_name">
                                    <div>
                                        <h3>{{ allUser.username }}</h3>

                                    </div>

                                </div>
                            </div>
                        </li>
                    </ul>
                </template>
            </div>

        </div>
    </div>
    <div v-else>Loading...</div>
</template>
<script>
export default {
    name: 'ChatWindow', // Make sure the name matches the one you're using in your template
    // Other component options and logic here
};
</script>