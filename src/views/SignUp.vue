<template>
  <section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
      <div class="row">
        <div class="col-md-6 text-center">
          <img
            class="img-fluid w-100"
            src="assets/img/illustrations/register.svg"
          />
        </div>
        <div class="col-md-5 col-xl-4 text-center text-md-start">
          <h2 class="display-6 fw-bold mb-5">
            <span class="underline pb-1"><strong>Sign up</strong></span>
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <input
                class="form-control"
                type="text"
                name="firstName"
                placeholder="First Name"
                v-model="firstName"
              />
            </div>
            <div class="mb-3">
              <input
                class="form-control"
                type="text"
                name="lastName"
                placeholder="Last Name"
                v-model="lastName"
              />
            </div>
            <div class="mb-3">
              <input
                class="form-control"
                type="text"
                name="username"
                placeholder="Username"
                v-model="username"
              />
            </div>
            <div class="mb-3">
              <input
                class="shadow-sm form-control"
                type="email"
                name="email"
                placeholder="Email"
                v-model="email"
              />
            </div>
            <div class="mb-3">
              <input
                class="form-control"
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                v-model="mobileNumber"
              />
            </div>
            <div class="mb-3">
              <input
                class="shadow-sm form-control"
                type="password"
                name="password"
                placeholder="Password"
                v-model="password"
              />
            </div>
            <div class="mb-3">
              <input
                class="shadow-sm form-control"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                v-model="confirmPassword"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Avatar</label>
              <input
                class="form-control"
                type="file"
                name="avatar"
                placeholder="avatar"
                @change="onAvatarChange"
              />
            </div>

            <div class="mb-5">
              <button
                class="btn btn-primary shadow"
                type="submit"
                :disabled="isFormIncomplete"
              >
                Create account
              </button>
            </div>
            <p class="text-muted">
              Have an account?
              <router-link :to="{ name: 'Login' }"
                >Log in&nbsp;<svg
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
              &nbsp;
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
import "vue3-toastify/dist/index.css";
export default {
  name: "SignupForm",
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const username = ref("");
    const email = ref("");
    const mobileNumber = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const avatar = ref(null);

    const onAvatarChange = (event) => {
      avatar.value = event.target.files[0];
    };

    // const error = ref(null);

    const store = useStore();

    const router = useRouter();

    const handleSubmit = async () => {
      try {
        await store.dispatch("signup", {
          firstName: firstName.value,
          lastName: lastName.value,
          username: username.value,
          email: email.value,
          mobileNumber: mobileNumber.value,
          password: password.value,
          avatar: avatar.value,
        });
        toast.success("Registered Successfully");
        router.push({ name: "VerifyAccount" });
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    };
    const isFormIncomplete = computed(() => {
      return (
        !firstName.value ||
        !lastName.value ||
        !username.value ||
        !email.value ||
        !mobileNumber.value ||
        !password.value ||
        !confirmPassword.value ||
        !avatar.value
      );
    });
    return {
      handleSubmit,
      firstName,
      lastName,
      username,
      mobileNumber,
      confirmPassword,
      email,
      password,
      // error,
      onAvatarChange,
      isFormIncomplete,
    };
  },
};
</script>

<style></style>
