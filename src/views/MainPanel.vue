<template>
  <div>
    <nav class="navbar navbar-dark bg-dark" role="navigation" aria-label="main navigation">
      <!-- <div class="navbar-toggler">
        <span class="navbar-toggler-icon"></span>
      </div> -->
      <div class="navbar-brand">
        <font-awesome-icon icon="bars"/>
        <span class="ml-4">Cashier</span>
      </div>
      <!-- <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarToggleExternalContent"
        aria-controls="navbarToggleExternalContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button> -->
    </nav>

    <router-view class="container-fluid"></router-view>
  </div>
</template>
