import { createStore } from "vuex";
import axios from "axios";
// import axiosInstance from "../axiosInterceptors";

/* eslint-disable */
// eslint-disable-next-line
const store = createStore({
  state: {
    user: null,
    authIsReady: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("User State Changed: ", state.user);
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    },
  },
  actions: {
    async signup(
      context,
      { firstName, lastName, username, email, mobileNumber, password, avatar }
    ) {
      //async code
      await axios
        .post(process.env.VUE_APP_BASE_URL + "user/register", {
          firstName,
          lastName,
          username,
          email,
          mobileNumber,
          password,
          avatar,
        })
        .then((res) => {
          if (res.data.success === true) {
            context.commit("setUser", res.user);
          }
        })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async login(context, { emailName, password }) {
      //async code
      console.log(emailName, password);
      await axios
        .post(
          process.env.VUE_APP_BASE_URL + "user/login",
          { emailName, password },

          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            console.log("logged in user", res.data);
            context.commit("setUser", res.data.user);
          }
        })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async forgotpassword(context, { emailName }) {
      await axios
        .post(
          process.env.VUE_APP_BASE_URL + "user/forgot/password",
          { emailName },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async verifyEmailAndMobile(context, { mailOtp, mobileOtp }) {
      await axios
        .post(
          process.env.VUE_APP_BASE_URL + "user/verify/otp",
          { mailOtp, mobileOtp },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async mailOtpReq(context) {
      await axios
        .get(process.env.VUE_APP_BASE_URL + "user/generate/email/otp", {
          withCredentials: true,
        })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async mobileOtpReq(context) {
      await axios
        .get(process.env.VUE_APP_BASE_URL + "user/generate/mobile/otp", {
          withCredentials: true,
        })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async verifyaccount(context, { mailOtp, mobileOtp }) {
      await axios
        .post(
          process.env.VUE_APP_BASE_URL + "user/verify/otp",
          {
            mailOtp,
            mobileOtp,
          },
          { withCredentials: true }
        )
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async refreshtoken(context) {
      await axios
        .get(process.env.VUE_APP_BASE_URL + "user/refresh-token", {
          withCredentials: true,
        })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async logout(context) {
      await signOut(process.env.VUE_APP_BASE_URL + "user/logout");
      context.commit("setUser", null);
    },
  },
});

axios
  .get(process.env.VUE_APP_BASE_URL + "user/me", { withCredentials: true })
  .then((res) => {
    console.log("user", res.data.user);
    store.commit("setAuthIsReady", true);
    store.commit("setUser", res.data.user);
  });

// export the store
export default store;
