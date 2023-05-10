<script setup>
// eslint-disable-next-line
/* eslint-disable */
import { ref } from 'vue'
import axiosInstance from '@/axiosInterceptors';

const users = ref([])
const name = ref('')

const createGroupChat = async () => {
    await axiosInstance.post('chat/create/group', { users: [...users.value], name: name.value }, {
        withCredentials: true
    }).then((res) => {
        console.log(res)
    })
}
</script>

<template>
 
    
</template>