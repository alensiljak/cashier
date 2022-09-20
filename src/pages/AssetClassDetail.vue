<template>
  <q-page padding class="text-colour2">
    <toolbar title="Asset Class Detail" />

    <div>{{ assetClass.fullname }}</div>
    <!-- <p>{{ assetClass.name }}</p> -->
    <div>Allocation: {{ assetClass.allocation }}</div>
    <!-- <div>{{ assetClass }}</div> -->

    <ul>
      <li v-for="symbol in symbols" :key="symbol.name">
        {{ symbol.name }}
        <ul>
          <li v-if="symbol.analysis">
            {{ symbol.analysis }} -
            <router-link
              :to="{ name: 'lots', params: { symbol: symbol.name } }"
              class="text-colour2"
            >
              lots
            </router-link>
          </li>
          <li v-for="account in symbol.accounts" :key="account.fullname">
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

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import appService from '../appService'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings } from '../lib/Configuration'
import Toolbar from '../components/CashierToolbar.vue'
import { SecurityAnalyser } from 'src/lib/securityAnalysis'
import { useRoute } from 'vue-router'
import { AssetClass, StockSymbol } from 'src/lib/AssetClass'
import { Collection } from 'dexie'
import { Account } from 'src/model'

const $route = useRoute()

const assetClass: Ref<AssetClass | any> = ref({})
const symbols: Ref<StockSymbol[]> = ref([])
const investmentAccounts: Ref<Account[]> = ref([])
const currency = ref(null)
const serverUrl = ref(null)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  let col: Collection = await appService.getInvestmentAccounts()
  let array: Account[] = await col.toArray()

  investmentAccounts.value = array
  await loadAssetClass()

  currency.value = await settings.get(SettingKeys.currency)
  serverUrl.value = await settings.get(SettingKeys.syncServerUrl)

  await securityAnalysis()
}

async function loadAssetClass() {
  const ac: AssetClass = await appService.loadAssetClass($route.params.fullname)
  assetClass.value = ac
  await loadConstituents()
}

/**
 * Load all constituents - stocks, currencies.
 */
function loadConstituents() {
  let childNames = assetClass.value.symbols
  let stocks = []

  // load account balances
  for (let i = 0; i < childNames.length; i++) {
    let childName = childNames[i]
    let stock: StockSymbol = {
      name: childName,
      accounts: [],
    }

    let account: Account | null = null
    // find all accounts with this commodity
    for (let j = 0; j < investmentAccounts.value.length; j++) {
      account = investmentAccounts.value[j]
      if (account.currency === childName) {
        stock.accounts.push(account)
      }
    }

    stocks.push(stock)
  }

  symbols.value = stocks
}

/**
 * Retrieve the security analysis from CashierSync
 */
async function fetchAnalysisFor(symbol: string) {
  let sec = new SecurityAnalyser()

  try {
    const result = await sec.getSecurityAnalysisFor(symbol)
    return result
  } catch (error: any) {
    console.error(error.message)
    //$q
  }
}

async function securityAnalysis() {
  // load analysis for all symbols
  for (let i = 0; i < symbols.value.length; i++) {
    let symbol = symbols.value[i].name

    let analysis = await fetchAnalysisFor(symbol)

    let stock = symbols.value.find((obj) => obj.name === symbol)
    stock.analysis = analysis
  }
}
</script>
