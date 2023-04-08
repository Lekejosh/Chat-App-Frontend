import { createStore } from "vuex";

import axiosInstance from "../axiosInterceptors";

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
    // async login(context, { email, password }) {
    //   console.log("Login action");

    //   //async code
    //   const res = await signInWithEmailAndPassword(auth, email, password);

    //   if (res) {
    //     context.commit("setUser", res.user);
    //   } else {
    //     throw new Error("Could not login");
    //   }
    // },
    // async logout(context) {
    //   console.log("logout action");
    //   await signOut(auth);
    //   context.commit("setUser", null);
    // },
  },
});

// const unsub = onAuthStateChanged(auth, (user) => {
//   store.commit("setAuthIsReady", true);
//   store.commit("setUser", user);
//   unsub();
// });

// export the store
export default store;
