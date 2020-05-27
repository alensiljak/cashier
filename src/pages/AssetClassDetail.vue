<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>{{ assetClass.fullname }}</div>
    <p>{{ assetClass.name }}</p>
    <div>Allocation: {{ assetClass.allocation }}</div>
    <!-- <div>{{ assetClass }}</div> -->

    <ul>
      <li v-for="stock in stocks" v-bind:key="stock.name">
        {{ stock.name }}
        <ul>
          <li v-if="stock.analysis">
            {{ stock.analysis }} -
            <router-link
              :to="{ name: 'lots', params: { symbol: stock.name }}"
              class="text-colour2"
            >lots</router-link>
          </li>
          <li v-for="account in stock.accounts" v-bind:key="account.fullname">
            {{ account.name }},
            {{ account.balance }} {{ account.currency }},
            {{ account.currentValue }} {{ account.currentCurrency }},
            <!-- {{ account }} -->
          </li>
        </ul>
      </li>
    </ul>
    <!-- <p>{{ stocks }}</p> -->
  </q-page>
</template>

<script>
import appService from "../appService";
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import { CashierSync } from "../lib/syncCashier";
import { SettingKeys, settings } from "../lib/Configuration";
import Vue from "vue";

export default {
  data() {
    return {
      assetClass: {},
      stocks: [],
      investmentAccounts: [],
      currency: null,
      serverUrl: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Asset Class Detail");

    // load data
    this.loadData();
  },

  methods: {
    loadData() {
      let that = this;
      appService.getInvestmentAccounts().then(col => {
        col
          .toArray()
          .then(array => {
            that.investmentAccounts = array;
            this.loadAssetClass();
          })
          .then(() => {
            settings
              .get(SettingKeys.currency)
              .then(value => (this.currency = value));

            settings
              .get(SettingKeys.syncServerUrl)
              .then(value => (this.serverUrl = value))
              .then(() => this.securityAnalysis());
          });
      });
    },
    loadAssetClass() {
      appService.loadAssetClass(this.$route.params.fullname).then(ac => {
        this.assetClass = ac;
        this.loadConstituents();
      });
    },
    /**
     * Load all constituents - stocks, currencies.
     */
    loadConstituents() {
      let childNames = this.assetClass.stocks;
      let stocks = [];

      // load account balances
      for (let i = 0; i < childNames.length; i++) {
        let childName = childNames[i];
        let stock = {
          name: childName,
          accounts: []
        };

        let account = null;
        // find all accounts with this commodity
        for (let j = 0; j < this.investmentAccounts.length; j++) {
          account = this.investmentAccounts[j];
          if (account.currency === childName) {
            stock.accounts.push(account);
          }
        }

        stocks.push(stock);
      }

      this.stocks = stocks;
    },
    /**
     * Retrieve the security analysis from CashierSync
     */
    async fetchAnalysis(symbol) {
      // console.log('fetching analysis for', symbol)
      let sync = new CashierSync(this.serverUrl);
      let result = sync.readSecurityAnalysis(symbol);
      return result;
    },
    securityAnalysis() {
      // todo: check if the CashierSync is running!

      // load analysis for all symbols
      for (let i = 0; i < this.stocks.length; i++) {
        let symbol = this.stocks[i].name;
        // console.log(symbol)
        this.fetchAnalysis(symbol).then(analysis => {
          let stock = this.stocks.find(obj => obj.name == symbol);
          // Use Vue.set to add a property to a reactive object.
          Vue.set(stock, "analysis", analysis);
        });
      }
    }
  }
};
</script>
