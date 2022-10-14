<template>
  <q-page padding class="text-colour2">
    <toolbar title="Cache" />

    <p>Control the cached data from Cashier-Sync.</p>
    <div>
      <!-- Payees -->
      <div class="row">
        <div class="col">Payees</div>
        <div class="col">{{ payeesStatus }}</div>
        <div class="col">
          <q-btn label="Fetch" color="secondary" text-color="accent" @click="fetchPayees" />
        </div>
        <div class="col">
          <q-btn label="Clear" color="secondary" text-color="accent" @click="clearPayees" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import Toolbar from '../components/CashierToolbar.vue'
import { CashierSync } from '../lib/syncCashier'
import { useQuasar } from 'quasar'
import { SettingKeys, settings, Constants } from '../lib/settings'
import CashierCache from '../lib/CashierCache'
import useNotifications from 'src/lib/CashierNotification'

const Notification = useNotifications()
const $q = useQuasar()
const NoneStatus = 'None'
const ExistsStatus = 'Exists'

const serverUrl: Ref<string> = ref('')
const accountsStatus = ref('unknown')
const assetAllocationStatus = ref('unknown')
const balancesStatus = ref('unknown')
const payeesStatus = ref('unknown')

onMounted(async () => {
  try {
    await loadSettings()
    await loadStatuses()
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }
})

async function cacheUrl(url: URL) {
  const cacher = new CashierCache(Constants.CacheName)

  try {
    await cacher.cache(url)

    await loadStatuses()
  } catch (error) {
    console.error(error)
    // show message
    Notification.negative('Error: ' + error)
  }

}


async function clearPayees() {
  let cashierSync = new CashierSync(serverUrl.value)
  const url = cashierSync.getPayeesUrl()
  await clearCache(url)
}

async function clearCache(url: URL) {
  const cache = new CashierCache(Constants.CacheName)
  await cache.clearCache(url)
  await loadStatuses()
}

async function fetchPayees() {
  Notification.positive('fetching payees')

  let cashierSync = new CashierSync(serverUrl.value)
  const url = cashierSync.getPayeesUrl()
  await cacheUrl(url)
}

async function loadSettings() {
  const value = await settings.get(SettingKeys.syncServerUrl)
  serverUrl.value = value

  return value
}

async function loadStatuses() {
  const sync = new CashierSync(serverUrl.value)

  // get the statuses of all cache items.
  const cache = await caches.open(Constants.CacheName)
  // Accounts
  const accounts = await cache.match(sync.getAccountsUrl())
  accountsStatus.value = accounts ? ExistsStatus : NoneStatus

  // Balances
  //const balances = await cache.match(sync.balancesUrl)
  //this.balancesStatus = balances ? ExistsStatus : NoneStatus

  //const currentValues = await cache.match(sync.currentValuesUrl)
  //this.assetAllocationStatus = currentValues ? ExistsStatus : NoneStatus

  const payees = await cache.match(sync.getPayeesUrl())
  payeesStatus.value = payees ? ExistsStatus : NoneStatus
}
</script>
