<template>
  <div id="app">
    <!-- This is the sidebar -->
    <nav id="menu">
      <header>
        <h2>Menu</h2>
      </header>
    </nav>
    <!-- this is the content area -->
    <main id="panel">
      <MainPanel/>
    </main>
  </div>
</template>
<script>
import MainPanel from "./views/MainPanel";
import Slideout from "slideout";

export default {
  name: "Cashier",
  mounted() {
    // Show the slideout menu.
    var slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
  },
  methods: {
  },
  components: {
    MainPanel
  }
};
</script>
<style lang="scss">
// The slideout styles have to be imported here.
@import "styles/slideout.scss";
</style>
