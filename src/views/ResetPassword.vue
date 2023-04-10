<template>
  <section class="py-4 py-md-5 mt-5">
    <div class="container py-md-5">
      <div class="row d-flex align-items-center">
        <div class="col-md-6 text-center">
          <img
            class="img-fluid w-100"
            src="assets/img/illustrations/desk.svg"
          />
        </div>
        <div class="col-md-5 col-xl-4 text-center text-md-start">
          <h2 class="display-6 fw-bold mb-4">
            Reset your <span class="underline">password</span>
          </h2>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <input
                class="form-control form-control form-control"
                type="password"
                name="password"
                placeholder="password"
                v-model="newPassword"
              />
            </div>
            <div class="mb-3">
              <input
                class="form-control form-control form-control"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                v-model="confirmPassword"
              />
            </div>
            <div class="mb-5">
              <button
                class="btn btn-primary shadow"
                type="submit"
                :disabled="isIncomplete"
              >
                Reset password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import axiosInstance from "@/axiosInterceptors";

export default {
  /* eslint-disable */
  // eslint-disable-next-line
  name: "ResetPassword",
  setup() {
    const newPassword = ref("");
    const confirmPassword = ref("");
    const router = useRouter();

    const route = useRoute();

    console.log(route.params.token);
    const handleSubmit = async () => {
      await axiosInstance
        .post(`user/password/reset/${route.params.token}`, {
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        })
        .then((res) => {
          toast.success(res.data.message);
          router.push({ name: "Login" });
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    };
    const isIncomplete = computed(() => {
      return (!newPassword.value || !confirmPassword.value);
    });
    return { newPassword, confirmPassword, handleSubmit, isIncomplete };
  },
};
</script>

<style></style>
