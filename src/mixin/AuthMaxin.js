const AuthMixin = {
  beforeRouteEnter(to, from, next) {
    const user = this.$store.getters.user;
    console.log("This is User from mixin", user);
    next();
  },
};
 
export default AuthMixin