<template>
  <div id="app">
    <!-- This is the sidebar -->
    <nav id="menu">
      <SideMenu />
    </nav>
    <!-- this is the content area -->
    <main id="panel">
      <router-view></router-view>
    </main>
  </div>
  <!-- app -->
</template>

<script lang="ts">
import Slideout from 'slideout';
import SideMenu from '../components/Sidebar.vue';

export default {
  name: 'Cashier',
  mounted() {
    // Show the slideout menu.
    // eslint-disable-next-line
    var slideout = new Slideout({
      panel: document.getElementById('panel'),
      menu: document.getElementById('menu'),
      padding: 256,
      tolerance: 70,
    });
  },
  methods: {},
  components: {
    SideMenu,
  },
  // watch: {
  //   sidebarOpen() {
  //     console.log('watching')
  //   }
  // }
};
</script>
<style lang="scss">
// The slideout styles have to be imported here.
@import "../css/slideout.scss";
@import "../css/styles.scss";
</style>
