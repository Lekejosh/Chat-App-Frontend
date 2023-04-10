import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import VerifyAccount from "../views/VerifyAccount.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import UserView from "../views/UserView.vue";
import NotFound from "../views/NotFound.vue";
// import store from "../store/index.js"; 


const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    // beforeEnter: (to, from, next) => {
    //   if (store.state.user) {
    //     next({ name: "UserView" });
    //   } else {
    //     next();
    //   }
    // },
  },

  {
    path: "/register",
    name: "SignUp",
    component: SignUp,
    // beforeEnter: (to, from, next) => {
    //   if (store.state.user) {
    //     next({ name: "UserView" });
    //   } else {
    //     next();
    //   }
    // },
  },
  {
    path: "/verify",
    name: "VerifyAccount",
    component: VerifyAccount,
    // beforeEnter: (to, from, next) => {
    //   if (store.state.user) {
    //     next();
    //   } else {
    //     next({ name: "Login" });
    //   }
    // },
  },
  {
    path: "/forgot",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/password/reset/:token",
    name: "ResetPassword",
    component: ResetPassword,
    props: true,
  },
  {
    path: "/user",
    name: "UserView",
    component: UserView,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
