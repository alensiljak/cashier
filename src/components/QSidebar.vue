<template>
  <q-drawer v-model="drawerOpen" bordered content-class="bg-colour1 text-amber-2">
    <q-scroll-area
      style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
    >
      <q-list padding>
        <!-- <q-item-label header>Navigation</q-item-label> -->

        <q-item to="/favourites" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="star" transform="grow-6 right-6"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Favourites</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/bal" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="balance-scale" transform="grow-6 right-6"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Balance Sheet</q-item-label>
          </q-item-section>
        </q-item> -->

        <q-item to="/tx" clickable v-ripple active-class="active-link">
          <!-- exact active -->
          <q-item-section avatar>
            <font-awesome-icon icon="money-bill-wave" transform="grow-6 right-6"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Transaction</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/journal" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="list-ul" transform="grow-6 right-6"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Journal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          :to="{name: 'accounts'}"
          clickable
          v-ripple
          active-class="active-link">
          <!-- exact -->
          <q-item-section avatar>
            <font-awesome-icon icon="wallet" transform="grow-6 right-6"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Accounts</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Entities submenu -->
        <!-- <q-expansion-item
          dark
          header-class="text-amber-2"
          expand-icon-class="text-amber-2"
          expand-separator
          icon="settings"
          label="Entities">
          <q-list>
            <q-item
              :inset-level="1"
              :to="{name: 'payees'}"
              exact
              clickable
              v-ripple
              active-class="active-link">
              <q-item-section avatar>
                <font-awesome-icon icon="users" transform="grow-6 right-6"/>
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
                <font-awesome-icon icon="luggage-cart" transform="grow-6 right-6"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Commodities</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item> -->

        <q-item to="/assetallocation" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="business-time" transform="grow-6 right-9"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Asset Allocation</q-item-label>
          </q-item-section>
        </q-item>

        <!-- I/O -->
        <q-expansion-item
          dark
          header-class="text-amber-2"
          expand-icon-class="text-amber-2"
          expand-separator
          icon="swap_horizontal_circle"
          label="I/O">
          <q-list>
            <!-- <q-item to="/sync" :inset-level="1" exact clickable v-ripple active-class="active-link">
              <q-item-section avatar>
                <font-awesome-icon icon="sync-alt" transform="grow-6 right-6"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Sync</q-item-label>
              </q-item-section>
            </q-item> -->

            <q-item
              to="/import"
              :inset-level="1"
              exact
              clickable
              v-ripple
              active-class="active-link">
              <q-item-section avatar>
                <font-awesome-icon icon="sign-in-alt" transform="grow-6 right-6"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Import</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              to="/export"
              :inset-level="1"
              exact
              clickable
              v-ripple
              active-class="active-link">
              <q-item-section avatar>
                <font-awesome-icon icon="sign-out-alt" transform="grow-6 right-6"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Export</q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item
              to="/webdav"
              :inset-level="1"
              exact
              clickable
              v-ripple
              active-class="active-link">
              <q-item-section avatar>
                <font-awesome-icon icon="folder" transform="grow-6 right-6"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>WebDAV</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
        </q-expansion-item>

        <!-- Asset Allocation -->
        <!-- <q-expansion-item
          dark
          header-class="text-amber-2"
          expand-icon-class="text-amber-2"
          expand-separator
          icon="card_travel"
          label="Asset Allocation">
          <q-list>
            
            <q-item to="/assetallocationsetup" exact clickable v-ripple active-class="active-link"
              :inset-level="1">
              <q-item-section avatar>
                <font-awesome-icon icon="cog" transform="grow-6 right-9"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>AA Setup</q-item-label>
              </q-item-section>
            </q-item> -->

            <!-- <q-item to="/prices" exact clickable v-ripple active-class="active-link"
              :inset-level="1">
              <q-item-section avatar>
                <font-awesome-icon icon="barcode" transform="grow-6 right-9"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Prices</q-item-label>
              </q-item-section>
            </q-item> -->

          </q-list>
        </q-expansion-item>

        <q-item to="/about" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="info" transform="grow-6 right-9"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-img class="absolute-top bg-colour5" style="height: 150px">
      <div class="absolute-bottom bg-transparent text-colour2">
        <q-avatar size="56px" class="q-mb-sm" @click="onHeaderClick">
          <img src="../../public/img/icons/icon64.png">
        </q-avatar>
        <!-- <div class="text-weight-bold">Cashier</div> -->
        <!-- <div>@cashier</div> -->
        <div style="font-size: 2rem;">
          Cashier
          <span style="font-size: 0.75rem" class="q-my-none">{{this.$version}}</span>
        </div>
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
    onHeaderClick() {
      // "reset browser history" by going back to the beginning.
      let back = (window.history.length - 1) * -1;
      // console.log('history:', window.history.length)
      window.history.go(back);

      //this.$router.push("/");
    },
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
  background-color: $colour4;
}
</style>
