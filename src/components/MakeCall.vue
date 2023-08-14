
<template>
    <div>
        <h1 style="text-align: center; color: #fff">Zoomish</h1>
        <div class="container">
            <div class="video-container">
                <div class="video">
                    <video ref="myVideo" playsinline muted autoplay style="width: 100%; max-width: 300px;"></video>
                </div>
                <div class="video">
                    <video v-if="callAccepted && !callEnded" ref="userVideo" playsinline autoplay
                        style="width: 100%; max-width: 300px;"></video>
                </div>
            </div>
            <div class="myId">
                <v-text-field label="Name" outlined v-model="name" style="margin-bottom: 20px;"></v-text-field>
                <v-btn color="primary" @click="copyID">
                    <v-icon left>mdi-assignment</v-icon>
                    Copy ID
                </v-btn>
                <v-text-field label="ID to call" outlined v-model="idToCall"></v-text-field>
                <div class="call-button">
                    <template v-if="callAccepted && !callEnded">
                        <v-btn color="secondary" @click="leaveCall">
                            End Call
                        </v-btn>
                    </template>
                    <template v-else>
                        <v-btn color="primary" @click="callUser(idToCall)">
                            <v-icon left>mdi-phone</v-icon>
                            Call
                        </v-btn>
                    </template>
                    {{ idToCall }}
                </div>
            </div>
            <div v-if="receivingCall && !callAccepted">
                <div class="caller">
                    <h1>{{ name }} is calling...</h1>
                    <v-btn color="primary" @click="answerCall">
                        Answer
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// eslint-disable-next-line
/* eslint-disable */
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import { useRouter, useRoute } from "vue-router";


const router = useRouter();

const route = useRoute();
const stream = ref();
const receivingCall = ref(false);
const caller = ref("");
const callerSignal = ref();
const callAccepted = ref(false);
const callEnded = ref(false);
const name = ref("");
const myVideo = ref();
const userVideo = ref();
const connectionRef = ref();
const idToCall = ref('');
const chatUsers = JSON.parse(localStorage.getItem("chatUsers"));
const me = localStorage.getItem('userId')
const mySocketId = ref('')
const voiceCall = ref(null)
const videoCall = ref(null)
const incomingVoiceCall = ref(null)
const incomingVideoCall = ref(null)

idToCall = 'YASNuJ6XekJi3N6NAAAJ'


const socket = io(process.env.VUE_APP_URL);


const props = defineProps({
    users: Array
})

const users = ref([])


const setName = (value) => {
    name.value = value;
};

const setIdToCall = (value) => {
    idToCall.value = value;
};

const copyID = () => {
    // Implementation for copying ID to clipboard
    // Use the appropriate method for Vue.js
};

const leaveCall = () => {
    callEnded.value = true;
    connectionRef.value.destroy();
};




onMounted(() => {

    const usersFilter = chatUsers.users.filter((user) => user._id !== me);
    const usersFilterMe = chatUsers.users.filter((user) => user._id === me);

    console.log(usersFilter);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        stream.value = stream;
        myVideo.value.srcObject = stream;
    });

    socket.on("callUser", (data) => {
        receivingCall.value = true;
        caller.value = data.from;
        name.value = data.name;
        callerSignal.value = data.signal;
    });

    socket.emit('outgoing-video-call', {
        to: usersFilter[0]._id,
        from: {
            id: usersFilterMe[0]._id,
            profilePicture: usersFilterMe[0].avatar.url,
            name: usersFilterMe[0].username

        },
        callType: videoCall.callType,
        roomId: chatUsers._id
    })

    socket.on('me', (id) => {
        console.log(id)
        mySocketId.value = id
    })

    users.value = props.users
    chatUsers.value = users.value.users
    console.log(chatUsers.value)

    callUsers(idToCall.value);
});


</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /* Set the width to 100% to take the full width of the screen */
}

.video-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    /* Set the width to 100% to take the full width of the screen */
}

.video {
    margin: 10px;
}

.myId {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.call-button {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.caller {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
}
</style>
