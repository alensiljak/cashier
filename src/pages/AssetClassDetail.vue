<template>
  <q-page padding class="text-colour2">
    <Toolbar title="Asset Class Detail" />

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
            <router-link :to="{ name: 'lots', params: { symbol: symbol.name } }" class="text-colour2">
              lots
            </router-link>
          </li>
          <li v-for="account in symbol.accounts" :key="account.name">
            {{ account.name }}, {{ account.balance?.amount }} {{ account.balance?.currency }},
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
import { CashierSync } from '../lib/cashier-sync'
import { SettingKeys, settings } from '../lib/settings'
import Toolbar from '../components/CashierToolbar.vue'
import { SecurityAnalyser, SecurityAnalysis } from 'src/lib/securityAnalysis'
import { useRoute } from 'vue-router'
import { AssetClass, StockSymbol } from 'src/lib/AssetClass'
import { Collection } from 'dexie'
import { Account } from 'src/model'
import useNotifications from '../lib/CashierNotification'

const $route = useRoute()
const Notification = useNotifications()

const assetClass: Ref<AssetClass | any> = ref({})
const symbols: Ref<StockSymbol[]> = ref([])
const investmentAccounts: Ref<Account[]> = ref([])
const currency = ref(null)
const serverUrl: Ref<string> = ref('')

onMounted(async () => {
  await loadData()
})

async function loadData() {
  investmentAccounts.value = await appService.loadInvestmentAccounts()
  await loadAssetClass()

  currency.value = await settings.get(SettingKeys.currency)
  serverUrl.value = await settings.get(SettingKeys.syncServerUrl)

  await securityAnalysis()
}

async function loadAssetClass() {
  const ac: AssetClass = await appService.loadAssetClass($route.params.fullname as string)
  assetClass.value = ac
  getConstituents()
}

/**
 * Load all constituents - stocks, currencies.
 */
function getConstituents() {
  let childNames = assetClass.value.symbols
  if (!childNames || childNames.length == 0) return;

  let stocks = []

  // load account balances
  for (let i = 0; i < childNames.length; i++) {
    let childName = childNames[i]
    let stock: StockSymbol = {
      name: childName,
      accounts: [],
      analysis: undefined
    }

    let account: Account | null = null
    // find all accounts with this commodity
    for (let j = 0; j < investmentAccounts.value.length; j++) {
      account = investmentAccounts.value[j]
      if (account.balance?.currency === childName) {
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
async function fetchAnalysisFor(symbol: string, stockAnalysis: SecurityAnalysis) {
  let sec = new SecurityAnalyser()

  try {
    stockAnalysis.yield = await sec.getYield(symbol);
    stockAnalysis.gainloss = await sec.getGainLoss(symbol);
  } catch (error: any) {
    let msg = symbol + ':' + error.message
    console.error(msg)
    Notification.negative(msg)
  }
}

/**
 * load analysis for all symbols
 */
async function securityAnalysis() {
  // Check if the server is online first.
  let sync = new CashierSync(serverUrl.value);
  try {
    let status = await sync.healthCheck()
  } catch {
    // not online
    console.info('Cashier server not online. Aborting fetching analysis.')
    return
  }

  for (let i = 0; i < symbols.value.length; i++) {
    let symbol = symbols.value[i].name
    let stock = symbols.value.find((obj) => obj.name === symbol)
    if (!stock) {
      throw new Error(`Stock ${symbol} not found!`)
    }

    if (!stock.analysis) {
      stock.analysis = {
        yield: '',
        gainloss: '',
      }
    }

    // Update the values
    await fetchAnalysisFor(symbol, stock.analysis)
  }
}
</script>
