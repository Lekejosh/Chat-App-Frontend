import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import "../public/assets/bootstrap/css/bootstrap.min.css";
import "vue3-toastify/dist/index.css";

const app = createApp(App);


const eventBus = app.config.globalProperties.$eventBus = createApp({});
app.config.globalProperties.$eventBus = eventBus;


app.use(router).use(store).mount("#app");
