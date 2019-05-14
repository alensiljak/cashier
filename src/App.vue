<template>
  <div id="app">
    <!-- trying out a 'slideout' menu -->
    <!-- <slideout-menu></slideout-menu> -->
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
import Vue from "vue";
//import 'slideout'
import Slideout from "vue-slideout";
import SlideoutMenu from "./components/SlideoutMenu";

//Vue.use(SlideoutMenu)

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
<style>
body {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .slideout-menu {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 256px;
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    z-index: 0;
    display: none;
    background-color: #1D1F20;
    color: white;
  }

  .slideout-menu-left {
    left: 0;
  }

  .slideout-menu-right {
    right: 0;
  }

  .slideout-panel {
    background-color: #4B5;
    color: white;
    position: relative;
    z-index: 1;
    will-change: transform;
    min-height: 100vh;
  }

  .slideout-open,
  .slideout-open body,
  .slideout-open .slideout-panel {
    overflow: hidden;
  }

  .slideout-open .slideout-menu {
    display: block;
  }
</style>
