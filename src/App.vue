<template>
  <div id="app">
    <Slideout>
      <SlideoutMenu />
    </Slideout>

    <nav class="navbar navbar-dark bg-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <img
          src="/img/icons/favicon-32x32.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt
        >
        <router-link to="/">Cashier</router-link>
      </div>

      <router-link to="/tx">New Transaction</router-link>
      <router-link to="/bal">Balance Sheet</router-link>
      <router-link to="/reg">Register</router-link>
      <router-link to="/payees">Payees</router-link>
      <router-link to="/settings">Settings</router-link>
      <router-link to="/about">About</router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>
<script>
import Slideout from "vue-slideout";
import SlideoutMenu from "./components/SlideoutMenu";

export default {
  name: "Cashier",
  mounted() {
    //console.log('from app:', this.$store)
    // slide menu
    //var slideout = new
    //console.log(this.$children[0].slideout.isOpen());

  },
  components: {
    Slideout,
    SlideoutMenu
  }
};
</script>
<style lang="scss">
// The slideout styles have to be imported here.
@import 'styles/slideout.scss'

</style>
