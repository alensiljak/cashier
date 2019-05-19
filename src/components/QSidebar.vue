<template>
  <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-colour1 text-colour5">
    <q-scroll-area
      style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
    >
      <q-list padding>
        <!-- <q-item-label header>Navigation</q-item-label> -->

        <!-- <q-item to="/" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>-->

        <q-item to="/bal" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <q-icon name="account_balance"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Balance Sheet</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="tx" active clickable v-ripple active-class="active-link">
        <!-- exact -->
          <q-item-section avatar>
            <q-icon name="payment"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>New Transaction</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/reg" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <q-icon name="toc"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Register</q-item-label>
          </q-item-section>
        </q-item>

        <q-expansion-item
          dark
          header-class="text-teal-9"
          expand-icon-class="text-teal-9"
          expand-separator
          icon="settings"
          label="Entities"
        >
          <q-item :inset-level="1"
            to="accounts"
            dark
            exact
            clickable
            v-ripple
            active-class="active-link"
            class="text-colour5"
          >
            <q-item-section avatar>
              <q-icon name="account_balance_wallet"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Accounts</q-item-label>
            </q-item-section>
          </q-item>

          <q-item :inset-level="1"
            to="payees"
            dark
            exact
            clickable
            v-ripple
            active-class="active-link"
            class="text-colour5"
          >
            <q-item-section avatar>
              <q-icon name="group"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Payees</q-item-label>
            </q-item-section>
          </q-item>

          <q-item :inset-level="1"
            to="commodities"
            dark
            exact
            clickable
            v-ripple
            active-class="active-link"
            class="text-colour5"
          >
            <q-item-section avatar>
              <q-icon name="category"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Commodities</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <!-- caption="Other elements" -->

        <q-item to="sync" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <q-icon name="sync"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Sync</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/about" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <q-icon name="info"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-img class="absolute-top bg-colour5" style="height: 150px">
      <div class="absolute-bottom bg-transparent text-colour2">
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
  color: $colour3;
}

// .router-link-active-exact {
//   background-color: greenyellow
// }
// .router-link-active {
//   color: $colour4;
// }
</style>
