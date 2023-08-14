<template>
  <section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
      <div class="row">
        <div class="col-md-5 col-xl-4 text-center text-md-start">
          <h2 class="display-6 fw-bold mb-5">
            <span class="underline pb-1"
              ><strong>Verification</strong><br
            /></span>
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <input
                class="form-control form-control"
                type="text"
                name="mailOtp"
                placeholder="Email OTP"
                v-model="mailOtp"
              />
            </div>
            <div class="mb-3">
              <p
                style="cursor: pointer"
                @click="mailOtpReq"
                :disabled="mailOtpDisabled"
              >
                Request Email OTP
              </p>
            </div>
            <div class="mb-3">
              <input
                class="form-control form-control"
                type="text"
                name="mobileOtp"
                placeholder="Mobile OTP"
                v-model="mobileOtp"
              />
            </div>
            <div class="mb-3">
              <p
                style="cursor: pointer"
                @click="mobileOtpReq"
                :disabled="mobileOtpDisabled"
              >
                Request Mobile OTP
              </p>
            </div>
            <div class="mb-5">
              <button
                class="btn btn-primary shadow"
                type="submit"
                :disabled="isFormIncomplete"
              >
                Verify
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
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
/* eslint-disable */
// eslint-disable-next-line

export default {
  name: "VerifyAccount",

  setup() {
    const mailOtp = ref("");
    const mobileOtp = ref("");
    const store = useStore();
    const router = useRouter();
    let mobileOtpDisabled = false;
    let mailOtpDisabled = false;

    const mobileOtpReq = async () => {
      if (!mobileOtpDisabled) {
        try {
          await store.dispatch("mobileOtpReq");
          toast.success("Otp Sent to Mobile Number");
          mobileOtpDisabled = true;
          setTimeout(() => {
            mobileOtpDisabled = false;
          }, 60000);
        } catch (err) {
          toast.error(err.message);
          mobileOtpDisabled = true;
          setTimeout(() => {
            mobileOtpDisabled = false;
          }, 60000);
        }
      }
    };
    const mailOtpReq = async () => {
      if (!mailOtpDisabled) {
        try {
          await store.dispatch("mailOtpReq");
          toast.success("Otp Sent to Mobile Number");
          mailOtpDisabled = true;
          setTimeout(() => {
            mailOtpDisabled = false;
          }, 60000);
        } catch (err) {
          toast.error(err.message);
          mailOtpDisabled = true;
          setTimeout(() => {
            mailOtpDisabled = false;
          }, 60000);
        }
      }
    };
    const handleSubmit = async () => {
      try {
        await store.dispatch("verifyaccount", {
          mobileOtp: mobileOtp.value,
          mailOtp: mailOtp.value,
        });
        toast.success("Account Verified Successfully");
        router.push({ name: "UserView" });
      } catch (err) {
        toast.error(err.message);
      }
    };
    const isFormIncomplete = computed(() => {
      return !mobileOtp.value || !mailOtp.value;
    });
    return {
      mailOtp,
      mobileOtp,
      mailOtpReq,
      mobileOtpReq,
      isFormIncomplete,
      handleSubmit,
    };
  },
};
</script>
