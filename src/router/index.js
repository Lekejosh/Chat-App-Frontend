import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import VerifyAccount from "../views/VerifyAccount.vue";
import ForgotPassword from "../views/ForgotPassword.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },

  {
    path: "/register",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/verify",
    name: "VerifyAccount",
    component: VerifyAccount,
  },
  {
    path: "/forgot",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
