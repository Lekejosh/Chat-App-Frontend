import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import TeamBoard from '../views/TeamBoard.vue';
import VerifyAccount from "../views/VerifyAccount.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import UserView from "../views/UserView.vue";
import NotFound from "../views/NotFound.vue";
import AuthMixin from "@/mixin/AuthMaxin";


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
    path:"/board",
    name:"TeamBoard",
    component:TeamBoard
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

