<template>
  <nav>
    <header class="text-center">
      <img src="/img/icons/icon64.png" class="mt-4">
      <h2 class="mt-2 mb-3">Cashier</h2>
    </header>
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/" exact class="nav-link">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/tx" class="nav-link">New Transaction</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/bal" class="nav-link">Balance Sheet</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/reg" class="nav-link">Register</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/payees" class="nav-link">Payees</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/settings" class="nav-link">Settings</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/about" class="nav-link">About</router-link>
      </li>
      <li>
        <router-link to="/q" class="nav-link">Quasar version</router-link>
      </li>
      <li>
      </li>
    </ul>
  </nav>
</template>
<style lang="scss" scoped>
@import '../styles/palette.scss';

// scoped
.nav-link{
  padding: 0.65rem 1rem;
}
.router-link-active.nav-link {
  color: $colour4;
}
.nav-link {
  color: $colour3;
}
header {
  background-color: $colour5;
  //color: $colour4;
  padding-bottom: 0.1em;
}
//.router-link-exact-active
</style>
