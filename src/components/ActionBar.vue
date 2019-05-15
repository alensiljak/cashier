<template>
  <div>
    <nav class="navbar navbar-dark" role="navigation" aria-label="main navigation">
      <!-- <div class="navbar-toggler">
        <span class="navbar-toggler-icon"></span>
      </div>-->
      <div class="navbar-brand">
        <span v-on:click="togglerClicked">
          <font-awesome-icon icon="bars"/>
        </span>
        <span class="ml-4">{{ title }}</span>
      </div>
    </nav>
  </div>
</template>
<script>
//import slideout from 'slideout';

export default {
  name: "ActionBar",
  props: ["title"],
  methods: {
    togglerClicked() {
      // todo: update the menu visibility? or raise an event
      console.log(this.$store.state.sidebarOpen)
    }
  },
};
</script>
<style lang="scss">
@import "../styles/palette.scss";

.navbar-dark {
  background-color: $colour-5;
}
// .navbar-brand {
//   color: $colour-5;
// }
</style>
