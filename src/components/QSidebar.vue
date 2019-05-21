<template>
  <q-drawer v-model="drawerOpen" bordered content-class="bg-colour1 text-red-10">
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

        <q-item to="/tx" clickable v-ripple active-class="active-link">
          <!-- exact active -->
          <q-item-section avatar>
            <q-icon name="payment"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Transaction</q-item-label>
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

        <!-- Entities submenu -->
        <q-expansion-item
          dark
          header-class="text-red-10"
          expand-icon-class="text-red-10"
          expand-separator
          icon="settings"
          label="Entities">
        <q-list>
          <q-item
            :inset-level="1"
            :to="{name: 'accounts'}"
            clickable
            v-ripple
            active-class="active-link">
            <!-- exact -->
            <q-item-section avatar>
              <q-icon name="account_balance_wallet"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Accounts</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            :inset-level="1"
            :to="{name: 'payees'}"
            exact
            clickable
            v-ripple
            active-class="active-link">
            <q-item-section avatar>
              <q-icon name="group"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Payees</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            :inset-level="1"
            :to="{name: 'commodities'}"
            exact
            clickable
            v-ripple
            active-class="active-link">
            <q-item-section avatar>
              <q-icon name="category"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Commodities</q-item-label>
            </q-item-section>
          </q-item>
          </q-list>
        </q-expansion-item>

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
          <img src="../../public/img/icons/icon64.png">
        </q-avatar>
        <!-- <div class="text-weight-bold">Cashier</div> -->
        <!-- <div>@cashier</div> -->
        <div style="font-size: 2rem;">Cashier</div>
      </div>
    </q-img>
  </q-drawer>
</template>

<script>
import { TOGGLE_DRAWER } from "../mutations";

export default {
  data() {
    return {
      // drawerOpen: this.$q.platform.is.desktop
    };
  },

  created() {
    // initial state of the drawer
    // this.$q.platform.is.desktop
    this.$store.commit(TOGGLE_DRAWER, this.$q.platform.is.desktop);
  },

  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    }
  },

  computed: {
    drawerOpen: {
      get() {
        return this.$store.state.drawerOpen;
      },
      set(value) {
        this.$store.commit(TOGGLE_DRAWER, value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/styles.scss";
@import "../styles/palette.scss";

.active-link {
  color: $colour3;
  // background-color: $colour4;
}
</style>
