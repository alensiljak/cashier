<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>{{ assetClass.fullname }}</div>
    <p>{{ assetClass.name }}</p>
    <div>Allocation: {{ assetClass.allocation }}</div>
    <!-- <div>{{ assetClass }}</div> -->

    <ul>
      <li v-for="stock in stocks" v-bind:key="stock.name">{{ stock.name }}
          <ul>
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

export default {
  data() {
    return {
      assetClass: {},
      stocks: [],
      investmentAccounts: []
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
        col.toArray().then(array => {
          that.investmentAccounts = array;
          this.loadAssetClass();
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

      // todo: load account balances
      for (let i = 0; i < childNames.length; i++) {
        let childName = childNames[i];
        let stock = {
          name: childName,
          accounts: []
        };

        let account = null;
        // todo: find all accounts with this commodity
        for (let j = 0; j < this.investmentAccounts.length; j++) {
          account = this.investmentAccounts[j];
          if (account.currency === childName) {
            stock.accounts.push(account);
          }
        }

        stocks.push(stock);
      }

      this.stocks = stocks;
    }
  }
};
</script>
