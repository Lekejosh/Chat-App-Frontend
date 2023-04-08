<template>
  <section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
      <div class="row">
        <div class="col-md-6 text-center">
          <img
            class="img-fluid w-100"
            src="assets/img/illustrations/login.svg"
          />
        </div>
        <div class="col-md-5 col-xl-4 text-center text-md-start">
          <h2 class="display-6 fw-bold mb-5">
            <span class="underline pb-1"><strong>Login</strong><br /></span>
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <input
                class="shadow form-control"
                type="emailName"
                name="emailName"
                placeholder="Email/Username"
                v-model="emailName"
              />
            </div>
            <div class="mb-3">
              <input
                class="shadow form-control"
                type="password"
                name="password"
                placeholder="Password"
                v-model="password"
              />
            </div>
            <div class="mb-5">
              <button
                class="btn btn-primary shadow"
                type="submit"
                :disabled="isFormIncomplete"
              >
                Log in
              </button>
            </div>
            <p class="text-muted">
              Don't have an Account?
              <router-link :to="{ name: 'SignUp' }"
                >Register&nbsp;<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icon-tabler-arrow-narrow-right"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <line x1="15" y1="16" x2="19" y2="12"></line>
                  <line x1="15" y1="8" x2="19" y2="12"></line>
                </svg>
              </router-link>
            </p>
            <p class="text-muted">
              <router-link :to="{ name: 'ForgotPassword' }"
                >Forgot your password?</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  /* eslint-disable */
  // eslint-disable-next-line
  name: "LoginForm",
  setup() {
    const emailName = ref("");
    const password = ref("");

    const store = useStore();

    const router = useRouter();

    const handleSubmit = async () => {
      try {
        await store.dispatch("login", {
          emailName: emailName.value,
          password: password.value,
        });
        toast.success("Welcome!!!");
        router.push({ name: "VerifyAccount" });
      } catch (err) {
        toast.error(err.message);
      }
    };
    const isFormIncomplete = computed(() => {
      return !emailName.value || !password.value;
    });

    return { handleSubmit, emailName, password, isFormIncomplete };
  },
};
</script>
