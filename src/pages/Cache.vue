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
        <div class="col">
          <q-btn
            label="Clear"
            color="secondary"
            text-color="accent"
            @click="clearAccounts"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">Account Balances</div>
        <div class="col">{{ balancesStatus }}</div>
        <div class="col">
          <q-btn
            label="Fetch"
            color="secondary"
            text-color="accent"
            @click="fetchBalances"
          />
        </div>
        <div class="col">
                      <q-btn
            label="Clear"
            color="secondary"
            text-color="accent"
            @click="clearBalances"
          />
        </div>
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
      balancesStatus: "unknown",
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Cache");

    this.loadSettings()
        // need to have value below in order to resolve the promise!
        .then(value => this.loadStatuses())
  },

  methods: {
    async loadSettings() {
      const value = await settings.get(SettingKeys.syncServerUrl);
      this.serverUrl = value;

      return value
    },
    async loadStatuses() {
      let cashierSync = new CashierSync(this.serverUrl);

      // get the statuses of all cache items.
      const storage = await caches.open(CacheName);
      // Accounts
      const accounts = await storage.match(cashierSync.accountsUrl);
      this.accountsStatus = accounts ? ExistsStatus : NoneStatus;

      // Balances
      const balances = await storage.match(cashierSync.balancesUrl);
      this.balancesStatus = balances ? ExistsStatus : NoneStatus;
    },

    async clearAccounts() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.accountsUrl;
      await this.clearCache(url);
    },
    async clearBalances() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.balancesUrl;
      await this.clearCache(url);
    },

    async cacheUrl(url) {
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
      await cache.put(url, response.clone());
      await this.loadStatuses()
    },

    async clearCache(url) {
      const cache = await caches.open(CacheName);
      await cache.delete(url);
      await this.loadStatuses()
    },

    async fetchAccounts() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.accountsUrl;
      await this.cacheUrl(url);
    },

    async fetchBalances() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.balancesUrl;
      await this.cacheUrl(url);
    },
  },
};
</script>