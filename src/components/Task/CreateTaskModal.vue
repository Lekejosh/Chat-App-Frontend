<template>
    <div class="task-modal">
        <div class="modal-content">
            <h2>Create New Task</h2>
            <input v-model="newTaskTitle" placeholder="Task Title" class="input-field" />
            <div class="button-group">
                <button @click="createTask" class="create-button">Create</button>
                <button @click="closeTaskModal" class="cancel-button">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
/* eslint-disable */
// eslint-disable-next-line
import axiosInstance from '@/axiosInterceptors';
import { useRoute } from 'vue-router';
import { ref, defineProps } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const chatId = localStorage.getItem('chatId')

const route = useRoute();
const props = defineProps({
    availableTasks: String,
    createNewTask: Function,
    closeTaskModal: Function,
});

const newTaskTitle = ref('');

const createTask = async () => {
    console.log(props.availableTasks)
    await axiosInstance.post(`task/create-task/${route.params.id}?groupId=${chatId}&taskId=${props.availableTasks}`, { title: newTaskTitle.value }, { withCredentials: true }).then((res) => {
        toast.success("Task created successfully")
    }).catch((err) => {
        toast.error("Error creating task, please try again")
    })
    props.closeTaskModal();
};
</script>

<style scoped>
.task-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    width: 320px;
}

.input-field,
.select-field {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.create-button,
.cancel-button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.create-button {
    background-color: #007bff;
    color: #fff;
}

.cancel-button {
    background-color: #ccc;
}
</style>
