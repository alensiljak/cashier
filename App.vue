<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <img src="/assets/icon32.png" width="30" height="30" class="d-inline-block align-top" alt>
        <router-link to="/">Cashier</router-link>
      </div>

      <router-link to="/tx">New Transaction</router-link>
      <router-link to="/bal">Balance Sheet</router-link>
      <router-link to="/reg">Register</router-link>
      <router-link to="/settings">Settings</router-link>
      <router-link to="/about">About</router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "Cashier",
  mounted() {
    //console.log('from app:', this.$store)
  }
}
</script>

