<template>
  <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-colour-1 text-colour-5">
    <q-scroll-area
      style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
    >
      <q-list padding>
        <!-- <q-item-label header>Navigation</q-item-label> -->

        <q-item to="/" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/bal" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="account_balance"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Balance Sheet</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/tx" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <q-icon name="payment"/>
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

    <q-img class="absolute-top bg-colour-5" style="height: 150px">
      <div class="absolute-bottom bg-transparent text-colour-2">
        <q-avatar size="56px" class="q-mb-sm">
          <img src="/img/icons/icon64.png">
        </q-avatar>
        <!-- <div class="text-weight-bold">Cashier</div> -->
        <!-- <div>@cashier</div> -->
        <div style="font-size: 2rem;">Cashier</div>
      </div>
    </q-img>
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

<style lang="scss" scoped>
@import "../styles/styles.scss";

.active-link {
  color: $colour-3;
}

// .router-link-active-exact {
//   background-color: greenyellow
// }
// .router-link-active {
//   color: $colour-4;
// }

</style>
