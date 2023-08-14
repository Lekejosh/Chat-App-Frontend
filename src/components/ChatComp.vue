<!-- ChatList.vue -->
<template>
  <div class="left">
    <!-- ... Your existing code for the chat list and search functionality ... -->
  </div>
</template>

<script setup>
// ... Your existing imports and setup logic ...
</script>

<!-- ChatWindow.vue -->
<template>
  <div class="right" v-bind:ref="messageBox">
    <!-- ... Your existing code for displaying messages ... -->
  </div>
</template>

<script setup>
// ... Your existing imports and setup logic ...
</script>

<!-- GroupInfo.vue -->
<template>
  <div class="group-section">
    <div class="group-body">
      <!-- ... Your existing code for displaying group information ... -->
    </div>
  </div>
</template>

<script setup>
// ... Your existing imports and setup logic ...
</script>

<!-- Combine them in one file -->
<template>
    <div class="container">
        <ChatList />
        <ChatWindow />
        <GroupInfo />
    </div>
</template>

<script setup>
import ChatList from '@/components/ChatList.vue';
import ChatWindow from '@/components/ChatWindow.vue';
import GroupInfo from '@/components/GroupInfo.vue';

// ... Your existing imports and setup logic ...
</script>

<style scoped>
/* ... Your existing styles ... */
</style>
