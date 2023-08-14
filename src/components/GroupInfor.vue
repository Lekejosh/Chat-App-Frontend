<template>
    <template v-if="chatUsers.isGroupChat">
    <div class="group-section">
        <div class="group-body">
            <div class="group-info">
                <div class="group-icon">
                    <img :src="previewImage || chatUsers.groupAvatar.url" :alt="chatUsers.chatName" class="ava" />
                    <div class="update-avatar">
                        <template v-if="chatUsers.groupAdmin.find((user) => user._id.toString() === userId)">
                            <template v-if="!previewImage">
                                <button @click="openFileExplorer">Update Avatar</button>
                                <template v-if="avatarOption !== 'default_image'">
                                    <button @click="deleteImage">Delete Avatar</button>
                                </template>
                            </template>
                            <template v-else>
                                <button @click="cancelUpdate">Cancel</button>
                                <button @click="saveImage">Save Image</button>
                            </template>
                        </template>


                    </div>
                </div>
                <template v-if="chatUsers.groupAdmin.find((user) => user._id.toString() === userId)">

                    <div class="group-name" @click="openPopupGroup">
                        {{ chatUsers.chatName }}
                    </div>
                </template>
                <template v-else>
                    <div class="group-name">
                        {{ chatUsers.chatName }}
                    </div>
                </template>
            </div>
            <div class="group-admins">
                <h4 style="color: darkgrey; font-weight: bold;">Admins</h4>
                <ul>
                    <li v-for="admin in chatUsers.groupAdmin" :key="admin._id">{{ admin.username }}</li>
                </ul>
                <template v-if="chatUsers.groupAdmin.find((user) => user._id.toString() === userId)">
                    <button @click="openPopupAddAdmin" class="create-workspace-btn">Add Admin</button>
                </template>
            </div>
            <div class="workspace-list">
                <h4 style="color: darkgrey; font-weight: bold;">Workspace</h4>
                <ul>
                    <li v-for="workspace in chatUsers.workspace" :key="workspace._id" @click="viewWorkspace(workspace._id)"
                        style="cursor: pointer;">{{ workspace.title }}</li>
                </ul>
                <button @click="openPopup" v-if="!chatUsers.workspace.length" class="create-workspace-btn">Create
                    Workspace</button>
            </div>
            <div class="user-list">
                <h4 style="color: darkgrey; font-weight: bold;">Members</h4>
                <ul>
                    <li v-for="members in chatUsers.users" :key="members._id">{{ members.username }}</li>
                </ul>
            </div>

            <!-- Exit Group Button -->
            <button style="margin: 0 auto; display: block; color: red;" @click="exitGroup(chatUsers._id)">Exit
                Group</button>

        </div>
    </div>
    </template>
     <template v-else>
                <div class="group-section">
                  <div class="group-body">
                    <div class="group-info">
                      <div class="group-icon">
                        <img :src="filterUserName[0].avatar.url" :alt="filterUserName[0].username" class="ava" />
                      </div>
                      <div class="group-name">
                        <h1>{{ filterUserName[0].username }}</h1>

                      </div>
                    </div>
                    <div class="personal-details" style="color:black">
                      <h2>Personal Details</h2>


                      <p><strong>status:</strong> {{ filterUserName[0].status }}</p>
                      <p><strong>Email:</strong> {{ filterUserName[0].email }}</p>
                      <p><strong>Phone Number:</strong> {{ filterUserName[0].mobileNumber }}</p>

                    </div>




                    <!-- Exit Group Button -->
                    <button style="margin: 0 auto; display: block; color: red;">Block User</button>

                  </div>
                </div>
              </template>
</template>

<script>
export default {
    name: 'GroupInfor', 
};
</script>