<template>
  <q-drawer v-model="drawerOpen" bordered content-class="bg-colour1 text-amber-2">
    <q-scroll-area
      style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
    >
      <q-list padding>
        <!-- <q-item-label header>Navigation</q-item-label> -->

        <q-item v-ripple to="/journal" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="list-ul" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Device Journal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple to="/favourites" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="star" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Favourites</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="liveModeOn" v-ripple to="tx-search" exact clickable
                active-class="active-link"
        >
          <q-item-section avatar>
            <font-awesome-icon icon="search-dollar" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Transaction Search</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="liveModeOn" v-ripple to="xact" exact clickable
                active-class="active-link"
        >
          <q-item-section avatar>
            <font-awesome-icon icon="scroll" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Xact</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/bal" exact clickable v-ripple active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="balance-scale" transform="grow-6 right-6"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Balance Sheet</q-item-label>
          </q-item-section>
        </q-item>-->

        <!-- <q-item v-ripple to="/tx" clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="money-bill-wave" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Transaction</q-item-label>
          </q-item-section>
        </q-item> -->

        <q-item v-ripple :to="{name: 'accounts'}" clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="wallet" transform="grow-6 right-6" />
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
        </q-expansion-item>-->

        <q-item v-ripple to="/assetallocation" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="business-time" transform="grow-6 right-9" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Asset Allocation</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Sync -->
        <q-item v-if="liveModeOn" v-ripple to="/sync" exact clickable 
                active-class="active-link"
        >
          <q-item-section avatar>
            <font-awesome-icon icon="sync-alt" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>CashierSync</q-item-label>
          </q-item-section>
        </q-item>

        <!-- I/O -->
        <q-expansion-item
          dark
          header-class="text-amber-2"
          expand-icon-class="text-amber-2"
          expand-separator
          icon="swap_horizontal_circle"
          label="I/O"
        >
          <q-list>
            <!-- Import -->
            <q-item
              v-ripple
              to="/import"
              :inset-level="1"
              exact
              clickable
              active-class="active-link"
            >
              <q-item-section avatar>
                <font-awesome-icon icon="sign-in-alt" transform="grow-6 right-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Import</q-item-label>
              </q-item-section>
            </q-item>

            <!-- Export -->
            <q-item v-ripple
                    to="/export"
                    :inset-level="1"
                    exact
                    clickable
                    active-class="active-link"
            >
              <q-item-section avatar>
                <font-awesome-icon icon="sign-out-alt" transform="grow-6 right-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Export</q-item-label>
              </q-item-section>
            </q-item>

            <!-- Git Repository -->
            <q-item v-if="liveModeOn" v-ripple to="repository" exact
                    :inset-level="1"
                    clickable active-class="active-link"
            >
              <q-item-section avatar>
                <font-awesome-icon icon="code-branch" transform="grow-6 right-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Repository</q-item-label>
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
            </q-item>-->
          </q-list>
        </q-expansion-item>

        <!-- Settings -->
        <q-item v-ripple :to="{name: 'settings'}" clickable active-class="active-link">
          <!-- exact -->
          <q-item-section avatar>
            <font-awesome-icon icon="cog" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple to="/about" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="info" transform="grow-6 right-9" />
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
          <img src="/icons/icon64.png">
        </q-avatar>
        <!-- <div class="text-weight-bold">Cashier</div> -->
        <!-- <div>@cashier</div> -->
        <div style="font-size: 2rem;">
          Cashier
          <span style="font-size: 0.75rem" class="q-my-none">{{ this.$version }}</span>
        </div>
      </div>
    </q-img>

    <div class="absolute-bottom text-right">
      <label>Live Mode:</label>
      <q-toggle v-model="liveModeOn" @input="liveModeToggle" />
      <font-awesome-icon icon="question-circle" transform="grow-9 left-5" 
                         @click="onHelpClick"
      />
    </div>

    <!-- help dialog -->
    <q-dialog v-model="liveModeHelpVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>-->
          <span>Live Mode uses CashierSync for all the data. CashierSync must be running.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="OK" color="amber-4" @click="liveModeHelpVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-drawer>
</template>

<script>
import { TOGGLE_DRAWER, SET_LEDGER_USE } from "../mutations";
import { CashierSync } from "../lib/syncCashier";
import { SettingKeys, settings } from "../lib/Configuration";

export default {
  data() {
    return {
      // drawerOpen: this.$q.platform.is.desktop
      liveModeOn: false,
      liveModeHelpVisible: false
    };
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
  },

  created() {
    // initial state of the drawer
    // this.$q.platform.is.desktop
    this.$store.commit(TOGGLE_DRAWER, this.$q.platform.is.desktop);

    this.liveModeOn = this.$store.state.useLedger;
  },

  methods: {
    onHeaderClick() {
      // "reset browser history" by going back to the beginning.
      let back = (window.history.length - 1) * -1;
      // console.log('history:', window.history.length)
      window.history.go(back);

      // this.$router.push("/");
    },
    onHelpClick() {
      this.liveModeHelpVisible = true;
    },
    liveModeToggle() {
      this.$store.commit(SET_LEDGER_USE, this.liveModeOn);
      if (this.liveModeOn) {
        // check if cashier sync is running
        settings.get(SettingKeys.syncServerUrl).then(serverUrl => {
          let sync = new CashierSync(serverUrl);
          sync
            .healthCheck()
            .catch(reason => {
              this.$q.notify({
                message: "Error: " + reason,
                color: "secondary"
              });
              // reset the setting
              this.liveModeOn = false;
            })
            .then(value => {
              //console.log('health check result:', value)
              if (value === "Hello World!") {
                this.$q.notify({
                  message: "The CashierSync server is running.",
                  color: "primary"
                });
              } else {
                this.$q.notify({
                  message: "The CashierSync server is not running.",
                  color: "secondary"
                });
              }
            });
        });
      }
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/styles.scss";
@import "../css/palette.scss";

.active-link {
  color: $colour3;
  background-color: $colour4;
}
</style>
