<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Asset Class Detail" />

    <div>{{ assetClass.fullname }}</div>
    <p>{{ assetClass.name }}</p>
    <div>Allocation: {{ assetClass.allocation }}</div>
    <!-- <div>{{ assetClass }}</div> -->

    <ul>
      <li v-for="stock in stocks" :key="stock.name">
        {{ stock.name }}
        <ul>
          <li v-if="stock.analysis">
            {{ stock.analysis }} -
            <router-link
              :to="{ name: 'lots', params: { symbol: stock.name } }"
              class="text-colour2"
            >
              lots
            </router-link>
          </li>
          <li v-for="account in stock.accounts" :key="account.fullname">
            {{ account.name }}, {{ account.balance }} {{ account.currency }},
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
import appService from '../appService'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings } from '../lib/Configuration'
import Vue from 'vue'
import Toolbar from '../components/Toolbar'

export default {
  components: {
    Toolbar
  },
  data() {
    return {
      assetClass: {},
      stocks: [],
      investmentAccounts: [],
      currency: null,
      serverUrl: null,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      let that = this
      let col = await appService.getInvestmentAccounts()
      let array = await col.toArray()
      that.investmentAccounts = array
      this.loadAssetClass()

      this.currency = await settings.get(SettingKeys.currency)
      this.serverUrl = await settings.get(SettingKeys.syncServerUrl)
      this.securityAnalysis()
    },
    async loadAssetClass() {
      const ac = await appService.loadAssetClass(this.$route.params.fullname)
      this.assetClass = ac
      await this.loadConstituents()
    },
    /**
     * Load all constituents - stocks, currencies.
     */
    loadConstituents() {
      let childNames = this.assetClass.symbols
      let stocks = []

      // load account balances
      for (let i = 0; i < childNames.length; i++) {
        let childName = childNames[i]
        let stock = {
          name: childName,
          accounts: [],
        }

        let account = null
        // find all accounts with this commodity
        for (let j = 0; j < this.investmentAccounts.length; j++) {
          account = this.investmentAccounts[j]
          if (account.currency === childName) {
            stock.accounts.push(account)
          }
        }

        stocks.push(stock)
      }

      this.symbols = stocks
    },
    /**
     * Retrieve the security analysis from CashierSync
     */
    async fetchAnalysis(symbol) {
      // console.log('fetching analysis for', symbol)
      let sync = new CashierSync(this.serverUrl)
      let result = sync.readSecurityAnalysis(symbol)
      return result
    },
    async securityAnalysis() {
      // todo: check if the CashierSync is running!

      // load analysis for all symbols
      for (let i = 0; i < this.symbols.length; i++) {
        let symbol = this.symbols[i].name
        // console.log(symbol)
        let analysis = await this.fetchAnalysis(symbol)
        let stock = this.symbols.find((obj) => obj.name == symbol)
        // Use Vue.set to add a property to a reactive object.
        Vue.set(stock, 'analysis', analysis)
      }
    },
  },
}
</script>
