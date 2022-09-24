<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'CashierSync'" />

    <p>CashierSync needs to be running and accessible.</p>
    <p>
      To run locally, install cashiersync with pip and run. Configure ledger
      with .ledgerrc in the root Termux user folder.
    </p>

    <h4 class="q-my-md">Settings</h4>
    <div class="q-my-md row">
      <div class="col">
        <!-- server URL -->
        <q-input
          v-model="serverUrl"
          label="Server URL"
          @change="saveSyncServerUrl"
        />
      </div>

      <div class="col text-center">
        <q-btn
          label="Test"
          color="secondary"
          text-color="accent"
          @click="onConnectClicked"
        />
      </div>
    </div>

    <!-- <div class="text-right">
      <q-btn label="Settings" :to="{name: 'settings'}" color="secondary" text-color="accent" />
    </div> -->

    <h4 class="q-my-md">Synchronization</h4>
    <q-list>
      <q-item>
        <q-item-section>
          <q-checkbox
            v-model="syncAccounts"
            label="Refresh accounts list. Clears the existing accounts list and replaces with the list from Ledger. This is needed if an account has/had a zero balance because Ledger will not list null-balance accounts."
          />
        </q-item-section>
        <q-item-label>
          <font-awesome-icon v-if="showAccountProgress" icon="sync-alt" spin />
        </q-item-label>
      </q-item>
      <q-item>
        <q-item-section>
          <q-checkbox
            v-model="syncBalances"
            label="Refresh account balances (ledger balance --flat --no-total)."
          />
        </q-item-section>
        <q-item-label>
          <font-awesome-icon v-if="showBalanceProgress" icon="sync-alt" spin />
        </q-item-label>
      </q-item>
      <q-item>
        <q-item-section>
          <q-checkbox
            v-model="syncAaValues"
            label="Refresh asset allocation current values (ledger b ^<root> -X <CUR> --flat --no-total)."
          />
        </q-item-section>
        <q-item-label>
          <font-awesome-icon v-if="showAssetProgress" icon="sync-alt" spin />
        </q-item-label>
      </q-item>
    </q-list>

    <div class="text-center q-mt-sm">
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onSyncClicked"
      >
        <font-awesome-icon
          icon="sync-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Sync
      </q-btn>
    </div>

    <div class="row q-my-lg">
      <div class="col text-center">
        <q-btn
          label="Cache API"
          color="accent"
          text-color="secondary"
          to="cache"
        />
      </div>
      <div class="col text-center">
        <q-btn color="accent" text-color="secondary" @click="onShutdownClick">
          Shutdown Server
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import appService from '../appService'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings, Constants } from '../lib/Configuration'
import CashierCache from '../lib/CashierCache'
import Toolbar from '../components/CashierToolbar.vue'

const router = useRouter()
const $q = useQuasar()

// data
const serverUrl = ref('http://localhost:8080') // the default value
const rootInvestmentAccount = ref(null)
const currency = ref(null)

const syncAccounts = ref(false)
const syncBalances = ref(true)
const syncAaValues = ref(true)
const showAccountProgress = ref(false)
const showBalanceProgress = ref(false)
const showAssetProgress = ref(false)

// methods

onMounted(async () => {
  await loadSettings()
})

async function loadSettings() {
  serverUrl.value = await settings.get(SettingKeys.syncServerUrl)
  rootInvestmentAccount.value = await settings.get(
    SettingKeys.rootInvestmentAccount
  )
  currency.value = await settings.get(SettingKeys.currency)
}

async function onConnectClicked() {
  const sync = new CashierSync(serverUrl.value)
  try {
    const response = await sync.healthCheck()

    $q.notify({ message: response, color: 'positive' })
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Connecting to CashierSync: ' + error.message,
      color: 'negative',
    })
  }
}

function onShutdownClick() {
  $q.notify({
    message: 'sending shutdown request',
    color: 'secondary',
  })

  let sync = new CashierSync(serverUrl.value)
  sync.shutdown()

  // refresh the page to update the server status?
  //window.location.reload(true)
}

async function saveSyncServerUrl() {
  // sync server.
  await settings.set(SettingKeys.syncServerUrl, serverUrl.value)

  $q.notify({ message: 'sync server saved', color: 'info' })
}

async function synchronizeAaValues() {
  const sync = new CashierSync(serverUrl.value)
  try {
    await sync.readCurrentValues()

    $q.notify({
      message: 'Asset Allocation values loaded',
      color: 'primary',
    })
  } catch (error) {
    console.error(error)
    $q.notify({ message: error.message, color: 'secondary' })
  }
}

/**
 * Download the List of Accounts.
 */
async function synchronizeAccounts() {
  const sync = new CashierSync(serverUrl.value)

  // Check if the accounts list is already cached. If not, cache it.
  const cache = await caches.open(Constants.CacheName)
  const accounts = await cache.match(sync.getAccountsUrl())
  if (!accounts) {
    const cacher = new CashierCache(Constants.CacheName)
    await cacher.cache(sync.getAccountsUrl())
  }

  //const ledgerAccounts = await sync.readAccounts()
  const ledgerAccounts = await accounts.json()

  // delete all accounts only after we have retrieved the new ones.
  await appService.deleteAccounts()
  await appService.importAccounts(ledgerAccounts)

  let message = 'accounts '
  if (accounts) {
    message += ' reused from cache'
  } else {
    message += ' loaded from the server'
  }
  $q.notify({ message: message, color: 'primary' })
}

/**
 * Loads all accounts (ledger accounts) + balances (ledger balance)
 */
async function synchronizeBalances() {
  const sync = new CashierSync(serverUrl.value)

  // Import the account balances.
  const lines = await sync.readBalances()
  await appService.importBalanceSheet(lines)

  $q.notify({ message: 'balances loaded', color: 'primary' })
}

async function onSyncClicked() {
  try {
    if (syncAccounts.value) {
      showAccountProgress.value = true
      await synchronizeAccounts()
      showAccountProgress.value = false
    }

    if (syncBalances.value) {
      showBalanceProgress.value = true
      await synchronizeBalances()
      showBalanceProgress.value = false
    }
    // Investment account balances in base currency, for Asset Allocation.
    if (syncAaValues.value) {
      showAssetProgress.value = true
      await synchronizeAaValues()
      showAssetProgress.value = false
    }
  } catch (error) {
    console.error(error)
    $q.notify({ message: error.message, color: 'negative' })
  }
}

function shutdown() {
  const sync = new CashierSync(serverUrl.value)
  sync
    .shutdown()
    .catch((error) => {
      console.error(error)
      $q.notify({ message: 'Error:' + error, color: 'secondary' })
    })
    .then((res) =>
      $q.notify({
        message: 'The server shutdown request sent.',
        color: 'primary',
      })
    )
}
</script>
