<template>
  <section class="py-5 mt-5">
    <div class="container">
      <div
        class="row row-cols-1 d-flex justify-content-center align-items-center"
      >
        <div class="col-md-10 text-center">
          <img class="img-fluid w-100" src="assets/img/illustrations/404.svg" />
        </div>
        <div class="col text-center">
          <h2 class="display-3 fw-bold mb-4">Page Not Found</h2>
          <p class="fs-4 text-muted">
            You didn't break the internet, but we can find what you're looking
            for.
          </p>
          <button class="btn btn-primary shadow" @click="back">Go Back</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style></style>
