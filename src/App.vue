<template>
  <div>
    <NavBar v-if="!isUserRoute" />
    <router-view />

    <FooterView v-if="!isUserRoute" />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import FooterView from "./components/FooterView.vue";

export default {
  components: {
    NavBar,
    FooterView,
  },
  computed: {
    isUserRoute() {
      return this.$route.path.startsWith("/user");
    },
  },
};
</script>
