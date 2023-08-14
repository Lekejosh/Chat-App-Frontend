<template>
  <div>
    <router-view />
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import NavBar from "./components/NavBar.vue";
import FooterView from "./components/FooterView.vue";

export default {
  components: {
    NavBar,
    FooterView,
  },
  watch: {
    $route(to, from) {
      this.checkRoute(to);
    },
  },
  mounted() {
    this.checkRoute(this.$route);
  },
  methods: {
    checkRoute(route) {
      if (route.path.startsWith("/user") || route.path.startsWith("/task")) {
        this.hideNavBarFooter();
      } else {
        this.showNavBarFooter();
      }
    },
    hideNavBarFooter() {
      this.isNavBarVisible = false;
      this.isFooterVisible = false;
    },
    showNavBarFooter() {
      this.isNavBarVisible = true;
      this.isFooterVisible = true;
    },
  },
  data() {
    return {
      isNavBarVisible: true,
      isFooterVisible: true,
    };
  },
};
</script>
