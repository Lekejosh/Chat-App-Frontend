<template>
    <div class="page-overlay">
        <div class="profile-page">
            <button class="cancel-button" style="margin-bottom: 15px;" @click="goBack">Cancel</button>
            <!-- Add Cancel button here -->
            <div class="profile-icon">
                <img :src="previewImage || avatar" alt="Profile Icon" />
                <div class="update-avatar">
                    <template v-if="!previewImage">
                        <button @click="openFileExplorer">Update Avatar</button>
                        <template v-if="avatarOption !== 'default_image'"><button @click="deleteImage">Delete
                                Avatar</button></template>
                    </template>
                    <template v-else>
                        <button @click="cancelUpdate">Cancel</button>
                        <button @click="saveImage">Save Image</button>
                    </template>
                </div>
            </div>
            <h2 style="color: white">{{ username }}</h2>

            <div class="personal-details" style="color: white">
                <h3>Personal Details</h3>

                <p><strong>Username:</strong> <input v-model="username" /></p>
                <p><strong>status:</strong> <input v-model="status" /></p>
                <p><strong>Email:</strong> {{ emailAddress }}</p>
                <p><strong>Phone Number:</strong> {{ phoneNumber }}</p>
                <button @click="updateProfile">Update Profile</button>
            </div>

            <div class="security" style="color: white">
                <h3>Security</h3>
                <button @click="deleteAccount">Delete Account</button>
                <button @click="deactivateAccount">Deactivate Account</button>
            </div>
        </div>
        <input type="file" style="display: none" accept="image/*" @change="handleFileChange" ref="fileInput" />
    </div>
</template>

<script setup>
// eslint-disable-next-line
/* eslint-disable */
import { ref, watch, onMounted } from 'vue'
import axiosInstance from '@/axiosInterceptors'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
    avatar: String,
    username: String,
    phoneNumber: String,
    emailAddress: String,
    avatarOption: String,
    status: String
})

const avatar = ref('')
const oldAvatar = ref('')
const username = ref('')
const phoneNumber = ref('')
const emailAddress = ref('')
const previewImage = ref('')
const avatarOption = ref('')
const status = ref('')

// Open the file explorer when the "Update Avatar" button is clicked
const openFileExplorer = () => {
    const fileInput = document.querySelector('input[type="file"]')
    fileInput.click()
}
// Add a new ref to store the selected file
const selectedFile = ref(null);

// Handle file selection from the file explorer
const handleFileChange = (event) => {
    oldAvatar.value = avatar.value
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        previewImage.value = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
        // Store the selected file in the selectedFile ref
        selectedFile.value = file;
    }
};

// Save the selected image
const saveImage = async () => {
    if (selectedFile.value) {
        const formData = new FormData();
        formData.append('avatar', selectedFile.value);

        await axiosInstance
            .post('user/update/avatar', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                avatar.value = previewImage.value;
                previewImage.value = ''
                avatarOption.value = ''
                toast.success("Avatar Updated successfully")
            })
            .catch((error) => {
                avatar.value = oldAvatar.value
                previewImage.value = '';
            });
    }
};


// Cancel the image update
const cancelUpdate = () => {
    previewImage.value = ''
}

const deleteImage = async () => {
    await axiosInstance.delete('user/update/avatar', { withCredentials: true }).then(() => {
        avatar.value = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
        previewImage.value = ''
        avatarOption.value = 'default_image'
        toast.success("Avatar Updated successfully")
    })
}

const goBack = () => {
    window.location.href = '/user'
}

const updateProfile = async () => {
    await axiosInstance.put('user/update/profile', { status: status.value, username: username.value }, { withCredentials: true }).then((res) => {
        username.value = username.value
        status.value = status.value
        toast.success("Profile Updated Successfully")
    }).catch((error) => {
        console.log(error)
    })
}

const deleteAccount = () => { }

const deactivateAccount = () => { }

onMounted(() => {
    // Initialize the component's data using the props
    phoneNumber.value = props.phoneNumber
    emailAddress.value = props.emailAddress
    username.value = props.username
    avatar.value = props.avatar
    avatarOption.value = props.avatarOption
    status.value = props.status
})

watch(
    () => props,
    (newProps) => {
        // Update the component's data when props change
        phoneNumber.value = newProps.phoneNumber
        emailAddress.value = newProps.emailAddress
        username.value = newProps.username
        avatar.value = newProps.avatar
        status.value = newProps.status
    },
    { deep: true }
)
</script>

<style scoped>
.page-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.profile-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-icon {
    position: relative;
}

.profile-icon img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
}

.update-avatar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.personal-details,
.security {
    margin-top: 20px;
}

h2 {
    margin-top: 10px;
}

button {
    padding: 5px 10px;
    width: 100%;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #e0e0e0;
}

strong {
    font-weight: bold;
}
</style>
