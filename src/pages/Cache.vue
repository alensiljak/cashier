<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>Control the cached data from Cashier-Sync.</div>
    <div>
      <div class="row">
        <div class="col">Accounts</div>
        <div class="col">{{ accountsStatus }}</div>
        <div class="col">
          <q-btn
            label="Fetch"
            color="secondary"
            text-color="accent"
            @click="fetchAccounts"
          />
        </div>
        <div class="col">Clear</div>
      </div>
      <div class="row">
        <div class="col">Account Balances</div>
        <div class="col">Status</div>
        <div class="col">Fetch</div>
        <div class="col">Clear</div>
      </div>
      Payees Fetch Clear Clear All
    </div>
  </q-page>
</template>

<script>
import { SET_TITLE, MAIN_TOOLBAR } from "../mutations";
import { SettingKeys, settings } from "../lib/Configuration";
import { CashierSync } from "../lib/syncCashier";
import ky from "ky";

const CacheName = "cashier";
const NoneStatus = "None";
const ExistsStatus = "Exists";

export default {
  data() {
    return {
      serverUrl: null,
      accountsStatus: "unknown",
    };
  },

  async created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Cache");

    await this.loadSettings()
    await this.loadStatuses()
  },

  methods: {
    async loadSettings() {
        console.log('we are loading settings')

        const value = await settings.get(SettingKeys.syncServerUrl);
      this.serverUrl = value;

        console.log('settings loaded')

      return Promise.resolve(value)
    },
    async loadStatuses() {
      let cashierSync = new CashierSync(this.serverUrl);
      
      // get the statuses of all cache items.
      const storage = await caches.open(CacheName);
      const accounts = await storage.match(cashierSync.accountsUrl);
      if (!accounts) {
        this.accountsStatus = NoneStatus;
      } else {
        this.accountsStatus = ExistsStatus;
      }
    },

    async fetchAccounts() {
      //CashierSync
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.accountsUrl;

      // get accounts from CashierSync
      let response = null;
      try {
        response = await ky(url);
        //const result = await response.text()
      } catch (reason) {
        console.error(reason);
        // show message
        this.$q.notify({
          message: "Error: " + reason,
          color: "secondary", // "teal-9", // green-9
          textColor: "amber-2",
        });

        return;
      }

      // cache them
      const cache = await caches.open(CacheName);
      cache.put(url, response.clone());
    },
  },
};
</script>