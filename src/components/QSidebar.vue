<template>
  <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-colour-1 text-colour-2">
    <q-scroll-area
      style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
    >
      <q-list padding>
        <q-item-label header>Navigation</q-item-label>

        <q-item to="/" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/tx" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>New Transaction</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/about" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="info"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-scroll-area>

    <q-img
      class="absolute-top"
      src="https://cdn.quasar-framework.org/img/material.png"
      style="height: 150px"
    >
    <!-- <div class="absolute-top bg-colour-5" style="height: 150px"> -->

      <div class="absolute-bottom bg-transparent">
        <q-avatar size="56px" class="q-mb-sm">
          <img src="/img/icons/icon64.png">
        </q-avatar>
        <div class="text-weight-bold">Cashier</div>
        <div>@cashier</div>
      </div>
    </q-img>
    <!-- </div> -->
  </q-drawer>
</template>
<script>
export default {
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    };
  },
  methods: {
    toggleDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    }
  }
};
</script>
