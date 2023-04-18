import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "../public/assets/bootstrap/css/bootstrap.min.css";
import "vue3-toastify/dist/index.css";

import store from "./store/index";

createApp(App).use(router).use(store).mount("#app");
