<template>
  <q-drawer v-model="drawerOpen" bordered content-class="bg-colour1 text-amber-2">
    <q-scroll-area style="
        height: calc(100% - 150px);
        margin-top: 150px;
        border-right: 1px solid #ddd;
      ">
      <q-list padding class="text-colour2">
        <!-- <q-item-label header>Navigation</q-item-label> -->

        <q-item v-ripple to="/home" exact clickable active-class="active-link">
          <q-item-section avatar>
            <home-icon />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple to="/journal" exact clickable active-class="active-link">
          <q-item-section avatar>
            <scroll />
          </q-item-section>
          <q-item-section>
            <q-item-label>Device Journal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple to="/favourites" exact clickable active-class="active-link">
          <q-item-section avatar>
            <star />
          </q-item-section>
          <q-item-section>
            <q-item-label>Favourites</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="liveModeOn" v-ripple to="tx-search" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="search-dollar" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Transaction Search</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="liveModeOn" v-ripple to="xact" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="list-ul" transform="grow-6 right-6" />
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

        <q-item v-ripple :to="{ name: 'accounts' }" clickable active-class="active-link">
          <q-item-section avatar>
            <landmark />
          </q-item-section>
          <q-item-section>
            <q-item-label>Accounts</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple :to="{ name: 'payees' }" clickable active-class="active-link">
          <q-item-section avatar>
            <users />
          </q-item-section>
          <q-item-section>
            <q-item-label>Payees</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Entities submenu -->
        <!-- <q-expansion-item
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
            <pie-chart />
          </q-item-section>
          <q-item-section>
            <q-item-label>Asset Allocation</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Scheduled Transactions -->
        <q-item v-ripple to="/scheduledtransactions" exact clickable active-class="active-link">
          <q-item-section avatar>
            <calendar-clock />
          </q-item-section>
          <q-item-section>
            <q-item-label>Scheduled Transactions</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Sync -->
        <q-item v-if="liveModeOn" v-ripple to="/sync" exact clickable active-class="active-link">
          <q-item-section avatar>
            <font-awesome-icon icon="sync-alt" transform="grow-6 right-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>CashierSync</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Export -->
        <!-- <q-item
          v-ripple
          to="/export"
          exact
          clickable
          active-class="active-link"
        >
          <q-item-section avatar>
            <font-awesome-icon
              icon="sign-out-alt"
              transform="grow-6 right-6"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>Export</q-item-label>
          </q-item-section>
        </q-item> -->

        <!-- Cloud Backup -->
        <q-item v-ripple to="/cloudbackup" exact clickable active-class="active-link">
          <q-item-section avatar>
            <upload-cloud />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cloud Backup</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Settings -->
        <q-item v-ripple :to="{ name: 'settings' }" clickable active-class="active-link">
          <!-- exact -->
          <q-item-section avatar>
            <settings-icon />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>

        <!-- help -->
        <q-item v-ripple to="/help" exact clickable active-class="active-link">
          <q-item-section avatar>
            <HelpCircle />
          </q-item-section>
          <q-item-section>
            <q-item-label>Help</q-item-label>
          </q-item-section>
        </q-item>

        <!-- about -->
        <q-item v-ripple to="/about" exact clickable active-class="active-link">
          <q-item-section avatar>
            <info-icon />
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-img class="absolute-top bg-colour5" style="height: 150px">
      <div class="absolute-bottom bg-transparent text-colour2 text-center">
        <q-avatar size="56px" class="q-mb-sm" @click="onHeaderClick">
          <img src="/icons/icon64.png" />
        </q-avatar>
        <!-- <div class="text-weight-bold">Cashier</div> -->
        <!-- <div>@cashier</div> -->
        <div style="font-size: 2rem" class="q-pb-none">Cashier</div>
      </div>
    </q-img>
  </q-drawer>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import {
  CalendarClock,
  HelpCircle, Home as HomeIcon, Info as InfoIcon, Landmark, PieChart,
  Scroll, Settings as SettingsIcon,
  Star, UploadCloud, Users
} from 'lucide-vue-next'

const $q = useQuasar()
const mainStore = useMainStore()
const { drawerOpen } = storeToRefs(mainStore)

// onCreated

// initial state of the drawer
mainStore.setDrawerOpen($q.platform.is.desktop as boolean)

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
<script lang="ts">
export default {
  computed: {
    liveModeOn: {
      get() {
        return this.$store.state.useLedger
      },
    },
  },

  methods: {
    onHeaderClick() {
      // "reset browser history" by going back to the beginning.
      let back = (window.history.length - 1) * -1
      // console.log('history:', window.history.length)
      window.history.go(back)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
@import '../css/palette.scss';

.active-link {
  color: $colour3;
  background-color: $colour4;
}
</style>
