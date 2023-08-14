import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import VerifyAccount from "../views/VerifyAccount.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import UserView from "../views/UserView.vue";
import NotFound from "../views/NotFound.vue";
import AuthMixin from "@/mixin/AuthMaxin";
import MakeCall from "../components/MakeCall.vue";
import Task from "../views/TaskManagement.vue";
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      isAuth: false,
    },
  },

  {
    path: "/register",
    name: "SignUp",
    component: SignUp,
    meta: {
      isAuth: false,
    },
  },

  {
    path: "/call/:group/:sockerId/",
    name: "MakeCall",
    component: MakeCall,
    meta: {
      isAuth: false,
    },
  },
  {
    path: "/verify",
    name: "VerifyAccount",
    component: VerifyAccount,
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/forgot",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: {
      isAuth: false,
    },
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
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/task/:id",
    name: "Task",
    component: Task,
    meta: {
      isAuth: false,
    },
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
  mixins: [AuthMixin],
});

// router.isReady().then(() => {
//   router.beforeEach((to, from, next) => {
//     if (to.meta.isAuth) {
//       let user = router.app.$store.getters.user;
//       console.log("This is User from index", user);
//     }
//     next();
//   });
// });

export default router;
