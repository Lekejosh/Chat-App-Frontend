import { createStore } from "vuex";


import axiosInstance from "../axiosInterceptors";



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
      await axiosInstance
        .post(
          "user/register",
          {
            firstName,
            lastName,
            username,
            email,
            mobileNumber,
            password,
            avatar,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res?.data?.accessToken}`;
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
      await axiosInstance
        .post(
          "user/login",
          { emailName, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res?.data?.accessToken}`;
            context.commit("setUser", res.data.user);
          }
        })
        .catch((error) => {
          throw new Error(error.res.data.message);
        });
    },
    async forgotpassword(context, { emailName }) {
      await axiosInstance
        .post(
          "user/forgot/password",
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
      await axiosInstance
        .post(
          "user/verify/otp",
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
      await axiosInstance
        .get("user/generate/email/otp", { withCredentials: true })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async mobileOtpReq(context) {
      await axiosInstance
        .get("user/generate/mobile/otp", { withCredentials: true })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    async verifyaccount(context, { mailOtp, mobileOtp }) {
      await axiosInstance
        .post(
          "user/verify/otp",
          { mailOtp, mobileOtp },
          { withCredentials: true }
        )
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    // async logout(context) {
    //   console.log("logout action");
    //   await signOut(auth);
    //   context.commit("setUser", null);
    // },
  },
});

axiosInstance.get("user/me", { withCredentials: true }).then((res) => {
  console.log("user", res.data.user);
  store.commit("setAuthIsReady", true);
  store.commit("setUser", res.data.user);
});

// export the store
export default store;
