<template>
  <div>
    <nav class="navbar navbar-dark" role="navigation" aria-label="main navigation">
      <!-- <div class="navbar-toggler">
        <span class="navbar-toggler-icon"></span>
      </div> -->
      <div class="navbar-brand">
        <font-awesome-icon icon="bars"/>
        <span class="ml-4">{{ title }}</span>
      </div>
    </nav>

    
  </div>
</template>
<script>
export default {
  name: 'ActionBar',
  props: ['title']
}
</script>
<style lang="scss">
@import '../styles/palette.scss';

.navbar-dark {
  background-color: $colour-5;
}
// .navbar-brand {
//   color: $colour-5;
// }
</style>
