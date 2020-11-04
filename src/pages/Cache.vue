<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Cache'" />

    <p>Control the cached data from Cashier-Sync.</p>
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
      <div class="row">
        <div class="col">Asset Allocation</div>
        <div class="col">{{ assetAllocationStatus }}</div>
        <div class="col">
          <q-btn
            label="Fetch"
            color="secondary"
            text-color="accent"
            @click="fetchAssetAllocation"
          />
        </div>
        <div class="col">
          <q-btn
            label="Clear"
            color="secondary"
            text-color="accent"
            @click="clearAssetAllocation"
          />
        </div>
      </div>

      <!-- Payees -->
      <div class="row">
        <div class="col">Payees</div>
        <div class="col">{{ payeesStatus }}</div>
        <div class="col">
          <q-btn
            label="Fetch"
            color="secondary"
            text-color="accent"
            @click="fetchPayees"
          />
        </div>
        <div class="col">
          <q-btn
            label="Clear"
            color="secondary"
            text-color="accent"
            @click="clearPayees"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { SettingKeys, settings, Constants } from '../lib/Configuration';
import { CashierSync } from '../lib/syncCashier';
import ky from 'ky';
import Toolbar from '../components/Toolbar'

const NoneStatus = 'None';
const ExistsStatus = 'Exists';

export default {
  components: {
    Toolbar
  },
  data() {
    return {
      serverUrl: null,
      accountsStatus: 'unknown',
      assetAllocationStatus: 'unknown',
      balancesStatus: 'unknown',
      payeesStatus: 'unknown',
    };
  },

  created() {
    this.loadSettings()
      // need to have value below in order to resolve the promise!
      .then((value) => this.loadStatuses());
  },

  methods: {
    async loadSettings() {
      const value = await settings.get(SettingKeys.syncServerUrl);
      this.serverUrl = value;

      return value;
    },
    async loadStatuses() {
      let cashierSync = new CashierSync(this.serverUrl);

      // get the statuses of all cache items.
      const cache = await caches.open(Constants.CacheName);
      // Accounts
      const accounts = await cache.match(cashierSync.accountsUrl);
      this.accountsStatus = accounts ? ExistsStatus : NoneStatus;

      // Balances
      const balances = await cache.match(cashierSync.balancesUrl);
      this.balancesStatus = balances ? ExistsStatus : NoneStatus;

      const currentValues = await cache.match(cashierSync.currentValuesUrl);
      this.assetAllocationStatus = currentValues ? ExistsStatus : NoneStatus;

      const payees = await cache.match(cashierSync.payeesUrl)
      this.payeesStatus = payees ? ExistsStatus : NoneStatus
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
    async clearAssetAllocation() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.currentValuesUrl;
      await this.clearCache(url);
    },
    async clearPayees() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.payeesUrl;
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
          message: 'Error: ' + reason,
          color: 'secondary', // "teal-9", // green-9
          textColor: 'amber-2',
        });

        return;
      }

      // don't cache invalid responses
      if (!response.ok) return;

      // cache them
      const cache = await caches.open(Constants.CacheName);
      await cache.put(url, response.clone());
      await this.loadStatuses();
    },

    async clearCache(url) {
      const cache = await caches.open(Constants.CacheName);
      await cache.delete(url);
      await this.loadStatuses();
    },

    async fetchAccounts() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.accountsUrl;
      await this.cacheUrl(url);
    },
    async fetchAssetAllocation() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.currentValuesUrl;
      await this.cacheUrl(url);
    },
    async fetchBalances() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.balancesUrl;
      await this.cacheUrl(url);
    },
    async fetchPayees() {
      let cashierSync = new CashierSync(this.serverUrl);
      const url = cashierSync.payeesUrl;
      await this.cacheUrl(url);
    }
  },
};
</script>
