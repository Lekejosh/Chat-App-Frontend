<script setup>
/* eslint-disable */
// eslint-disable-next-line
import axiosInstance from "@/axiosInterceptors";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CreateCardModal from "@/components/Task/CreateCardModal.vue";
import CreateTaskModal from "@/components/Task/CreateTaskModal.vue";
import TaskDetailsPopup from '@/components/Task/TaskDetailsPopup.vue'

const route = useRoute();
const boardTitle = ref('');
const tasks = ref([]);
const selectedTaskCards = ref([]);
const selectedTask = ref('')
const showModal = ref(false);
const showTaskModal = ref(false)
const singleCard = ref('')
const checklistItems = ref([])
const chatId = localStorage.getItem('chatId')
const activites = ref([])
const members = ref([])
const taskMembers = ref({})

const router = useRouter();

const goBackToUserPage = () => {
    router.push("/user"); // Change the route to the appropriate one
};

const showCreateCardModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const showCreateTaskModal = () => {
    showTaskModal.value = true;
};

const closeTaskModal = () => {
    showTaskModal.value = false;
};

const showTaskDetailsPopup = ref(false);

const openTaskDetailsPopup = () => {
    showTaskDetailsPopup.value = true;
};

const closeTaskDetailsPopup = () => {
    showTaskDetailsPopup.value = false;
};


const topActivities = computed(() => {
    return activites.value.slice(0, 10);
});
const showAllActivities = ref(false);
const showReduceButton = computed(() => showAllActivities.value && activites.value.length > 10);

const getCard = async (id) => {
    await axiosInstance.get(`task/card/${id}/${route.params.id}?groupId=${chatId}`, { withCredentials: true }).then((res) => {
        singleCard.value = res.data.card
        checklistItems.value = res.data.card.checklist
        console.log(res.data.card.checklist)
        members.value = res.data.card.members
        console.log(res.data.card)
        console.log(res.data.card.members)
        openTaskDetailsPopup()
    })
}


const getTask = async (id) => {
    try {
        const response = await axiosInstance.get(`task/get/${id}?groupId=${chatId}`, { withCredentials: true });
        selectedTaskCards.value = response.data.task.cards;
        selectedTask.value = response.data.task
        console.log(response.data.task)
        taskMembers.value = response.data.task.members
    } catch (error) {
        console.error(error);
        toast.error("Error fetching task details");
    }
    await axiosInstance.get(`activity/task?chatId=${chatId}&taskId=${id}`, { withCredentials: true }).then((res) => {
        activites.value = res.data.activity
    })
};

onMounted(async () => {
    try {
        const response = await axiosInstance.get(`task/board/${route.params.id}?groupId=${chatId}`, { withCredentials: true });
        tasks.value = response.data.board.tasks;
        boardTitle.value = response.data.board.title;

    } catch (error) {
        console.error(error);
        toast.error("Error fetching tasks");
    }
});
</script>

<template>
    <div class="container">
        <div class="sidebar">
            <h1>{{ boardTitle }}</h1>
            <ul class="task-list">
                <li class="task" v-for="task in tasks" :key="task._id" @click="getTask(task._id)"
                    :class="{ active: selectedTaskCards && selectedTaskCards._id === task._id }">
                    {{ task.title }}
                </li>
            </ul>
            <button class="create-task-button" @click="showCreateTaskModal">Add New Task</button>
            <button class="create-task-button" @click="goBackToUserPage">Go Back</button>
        </div>
       
        <div class="main-content">
            <div class="task-details">
                <h2>{{ selectedTask.title }}</h2>
                <template v-if="selectedTaskCards.length > 0">
                    <li v-for="task in selectedTaskCards" :key="task._id" class="task" style="list-style: none;"
                        @click="getCard(task._id)">
                        {{ task.title }}
                        <span v-if="task.completed" class="completed-task">Completed</span>
                    </li>
                    <button class="create-task-button" @click="showCreateCardModal">Add Task</button>
                    <CreateCardModal v-if="showModal" :availableTasks="selectedTask._id" :createNewTask="createNewTask"
                        :closeModal="closeModal" />
                </template>
                <template v-if="selectedTask._id && selectedTaskCards.length === 0">
                    <button class="create-task-button" @click="showCreateCardModal">Add Task</button>
                    <CreateCardModal v-if="showModal" :availableTasks="selectedTask._id" :createNewTask="createNewTask"
                        :closeModal="closeModal" />
                </template>

                <div v-if="selectedTaskCards.length > 0" class="top-activities">
                    <h3>Activities</h3>
                    <ul>
                        <li v-for="(activity, index) in (showAllActivities ? activites : topActivities)"
                            :key="activity._id">
                            {{ activity.activites.description }}
                            <span v-if="index === 9 && !showAllActivities && !showReduceButton">
                                <button class="show-more-button" @click="showAllActivities = true">
                                    Show All Activities
                                </button>
                            </span>
                        </li>
                    </ul>
                    <div v-if="showReduceButton">
                        <button class="show-more-button" @click="showAllActivities = false">
                            Reduce
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <CreateTaskModal v-if="showTaskModal" :availableTasks="selectedTask._id" :createNewTask="createNewTask"
            :closeTaskModal="closeTaskModal" />
        <TaskDetailsPopup :showPopup="showTaskDetailsPopup" :task="selectedTask" :selectedTaskCards="singleCard"
            :closePopup="closeTaskDetailsPopup" :checklist="checklistItems" :members="members" :taskMembers="taskMembers" />
    </div>
</template>
<style scoped>
body {
    margin: 0;
    font-family: Arial, sans-serif;
}

.container {
    display: flex;
    height: 100vh;
}

.sidebar {
    flex: 1;
    background-color: #f3f3f3;
    padding: 20px;
    border-right: 1px solid #ccc;
}

.main-content {
    flex: 2;
    padding: 20px;
}

h1 {
    margin-top: 0;
}

.task-list {
    list-style: none;
    padding: 0;
}

.task {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 5px;
    cursor: pointer;
}

.task:hover {
    background-color: #f9f9f9;
}

.task-title {
    flex: 1;
}

.completed-task {
    color: green;
}

.task-details {
    border: 1px solid #ccc;
    padding: 20px;
    background-color: #fff;
    min-height: 200px;
}

.task.active {
    background-color: #f9f9f9;
    font-weight: bold;
}

.activities-header {
    font-size: 18px;
    margin-bottom: 10px;
}

.activities-list {
    list-style: none;
    padding: 0;
}

.activity-item {
    padding: 5px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.show-more-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.completed-task {
    color: green;
    margin-left: auto;
}

.show-more-button:hover {
    background-color: #0056b3;
}
</style>