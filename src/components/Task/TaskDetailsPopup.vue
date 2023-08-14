<template>
    <div class="task-details-popup" v-if="showPopup">
        <div class="popup-content">
            <div class="popup-columns">
                <div class="column">
                    <h3>{{ selectedTaskCards.title }}</h3>
                    <p> in {{ task.title }}</p>
                </div>
            </div>
            <div class="popup-columns">
                <div class="column">
                    <h3>Description</h3>

                    <div>
                        <span class="input-description" :style="{
                            fontWeight: selectedTaskCards.description ? 'bold' : 'normal',
                            textDecoration: selectedTaskCards.description ? 'none' : 'underline',
                            color: selectedTaskCards.description ? '#000' : '#999'
                        }" @click="showDescriptionInput">
                            {{ selectedTaskCards.description || "Input Description" }}
                        </span>
                    </div>
                    <div v-if="editingDescription">
                        <textarea v-model="newDescription" rows="4" cols="50"></textarea>
                        <div class="button-container">
                            <button @click="saveDescription">Save</button>
                            <button @click="cancelDescription">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="popup-columns">
                <div class="column">

                    <div class="column">
                        <h3>Checklist</h3>
                        <div v-if="checklist.length > 0" class="percentage-bar-container">
                            <div class="percentage-bar" :style="{ width: completedPercentage + '%' }"></div>
                        </div>
                        <ul class="checklist">
                            <li v-for="item in checklist" :key="item._id">
                                <div class="checklist-header">
                                    <label class="checkbox-container">
                                        <input type="checkbox" v-model="item.isCompleted"
                                            @change="toggleChecklistItem(item._id,item.cardId, item.isCompleted)" />
                                        <span class="checkmark"></span>
                                    </label>

                                    {{ item.title }}
                                    <span class="delete" style="color:red; padding: 20px;cursor:pointer;"
                                        @click="deleteChecklistItem(item._id)">delete</span>
                                </div>
                            </li>
                            <li class="add-checklist" @click="showChecklistInput">Add Checklist</li>
                            <div v-if="addingChecklist">
                                <input v-model="newChecklistTitle" placeholder="Input Checklist Title" />
                                <div class="button-container">
                                    <button @click="addChecklist">Add</button>
                                    <button @click="cancelChecklist">Cancel</button>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- <div class="popup-columns">
                <div class="column">
                    <h3>Assigned Member(s)</h3>
                    <ul class="checklist">
                        <li v-for="item in checklist" :key="item.id">
                            <div class="checklist-header">


                                {{ item.title }}
                                <span class="delete" style="color:red; padding: 20px;cursor:pointer;"
                                    @click="deleteChecklistItem(item._id)">delete</span>
                            </div>
                        </li>
                        <li class="add-checklist" @click="showAddUserInput">Assign User</li>
                        <div v-if="addingChecklist">
                            <select v-model="newUser" multiple>
                                <option v-for="option in taskMembers" :key="option" :value="option">{{ option }}
                                </option>
                            </select>
                            <div class="button-container">
                                <button @click="addMember">Add</button>
                                <button @click="cancelAddUser">Cancel</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div> -->
            <button @click="closePopup" class="close-button">Close</button>
        </div>
    </div>
</template>


<script setup>
// eslint-disable-next-line
/* eslint-disable */
import { ref, defineProps, computed, onMounted } from 'vue';
import axiosInstance from '@/axiosInterceptors';
import { useRoute } from 'vue-router'
const chatId = localStorage.getItem('chatId')
const activity = ref([])

const route = useRoute()

const props = defineProps({
    showPopup: Boolean,
    task: Object,
    selectedTaskCards: Object,
    checklist: Array,
    taskMembers: Array,
    members: Array,
    closePopup: Function,
});

const editingDescription = ref(false);
const newDescription = ref('');


const toggleChecklistItem = async (id,card, state) => {
    await axiosInstance.put(`task/checklist/complete/${card}/${id}?completed=${state}&groupId=${chatId}&taskId=${props.task._id}`, {}, { withCredentials: true }).then((res) => {
    })
}

const showDescriptionInput = () => {
    editingDescription.value = true;
    newDescription.value = props.selectedTaskCards.description || '';
};

const saveDescription = async () => {

    if (newDescription.value !== '') {
        await axiosInstance.put(`task/card/edit/${props.selectedTaskCards._id}/${route.params.id}?groupId=${chatId}&taskId=${props.task._id}`, { description: newDescription.value }, { withCredentials: true }).then((res) => {
            console.log(res)
            props.selectedTaskCards.description = newDescription.value;
            editingDescription.value = false;
        })
    }
};

const cancelDescription = () => {
    editingDescription.value = false;
    newDescription.value = '';
};
const addingChecklist = ref(false);
const newChecklistTitle = ref('');
const addingUser = ref(false)
const newUser = ref([])

const showChecklistInput = () => {
    addingChecklist.value = true;
};
const showAddUserInput = () => {
    addingUser.value = true
}

const addChecklist = async () => {
    if (newChecklistTitle.value.trim() !== '') {
        console.log(props.selectedTaskCards)
        await axiosInstance.post(`task/checklist/${props.selectedTaskCards._id}?groupId=${chatId}&taskId=${props.task._id}`, { title: newChecklistTitle.value }, { withCredentials: true }).then((res) => {
            console.log(res)
            props.checklist.push(res.data.card);
        })
        newChecklistTitle.value = '';
        addingChecklist.value = false;
    }
};

const addMember = async () => {
    if (newChecklistTitle.value.trim() !== '') {
        console.log(props.selectedTaskCards)
        await axiosInstance.post(`task/card/member/${props.selectedTaskCards._id}/${route.params.id}`, { users: newUser.value }, { withCredentials: true }).then((res) => {
            console.log(res)
        })
        newChecklistTitle.value = '';
        addingChecklist.value = false;
    }
};

const cancelChecklist = () => {
    newChecklistTitle.value = '';
    addingChecklist.value = false;
};

const cancelAddUser = () => {
    newUser.value = '';
    addingUser.value = false;
};

const completedPercentage = computed(() => {
    const completedCount = props.checklist.filter(item => item.isCompleted).length;
    const totalCount = props.checklist.length;
    return totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
});

onMounted(async () => {
    await axiosInstance.get(`activity?chatId=${chatId}`, { withCredentials: true }).then((res) => {

        activity.value = res.data.activity
    })

})

</script>

<style scoped>
.task-details-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.popup-columns {
    display: flex;
    flex-direction: row;
}

.column {
    flex: 1;
}

.close-button {
    margin-top: 10px;
    background-color: #f3f3f3;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

.input-description {
    color: #999;
    cursor: pointer;
    text-decoration: underline;
}

.button-container {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}


.checklist {
    list-style: none;
    padding-left: 0;
    margin-top: 10px;
}

.checklist li {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
}

.checklist li:last-child {
    border-bottom: none;
}

.checklist li::before {
    content: "•";
    color: #666;
    font-size: 1.2em;
    margin-right: 10px;
}

/* Updated styles */

.checklist {
    list-style: none;
    padding: 0;
    margin: 10px 0;
}

.checklist li {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}

.checklist li::before {
    content: "";
}

.checklist-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.activity-list {
    list-style: none;
    padding-left: 0;
    margin-top: 10px;
}

.activity-list li {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
}

.activity-list li:last-child {
    border-bottom: none;
}

.add-checklist {
    color: #007bff;
    cursor: pointer;
    margin-top: 5px;
}

.add-checklist:hover {
    text-decoration: underline;
}


.checkbox-container {
    display: inline-block;
    position: relative;
    padding-left: 30px;
    margin-right: 10px;
    cursor: pointer;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.checkbox-container input:checked~.checkmark {
    background-color: #007bff;
    border: 1px solid #007bff;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked~.checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.percentage-bar-container {
    margin-top: 10px;
    height: 10px;
    background-color: #ccc;
    border-radius: 5px;
    overflow: hidden;
}

.percentage-bar {
    height: 100%;
    background-color: #007bff;
    width: 0;
    /* This will be adjusted dynamically using inline style */
    transition: width 0.3s ease-in-out;
}
</style>
