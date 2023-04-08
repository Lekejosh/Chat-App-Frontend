<template>
  <section class="py-4 py-md-5 mt-5">
     <div class="container py-md-5">
  <div class="row d-flex align-items-center">
    <div class="col-md-6 text-center">
      <img class="img-fluid w-100" src="assets/img/illustrations/desk.svg" />
    </div>
    <div class="col-md-5 col-xl-4 text-center text-md-start">
      <h2 class="display-6 fw-bold mb-4">
        Forgot your <span class="underline">password</span>?
      </h2>
      <p class="text-muted">
        Enter the email or username associated with your account and we&#39;ll
        send you a reset link.
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <input
            class="shadow form-control"
            type="emailName"
            name="emailName"
            placeholder="Email / Username"
            v-model="emailName"
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
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  name: "ForgotPassword",
  setup() {
    const emailName = ref("");

    const store = useStore();
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        await store.dispatch("forgotpassword", {
          emailName: emailName.value,
        });
        toast.success("Reset Token Sent to Email Address");
        router.push({ name: "Login" });
      } catch (err) {
        toast.error(err.message);
      }
    };
    const isIncomplete = computed(() => {
      return !emailName.value;
    });
    return { handleSubmit, emailName, isIncomplete };
  },
};
</script>

<style></style>
