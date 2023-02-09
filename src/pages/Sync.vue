<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'CashierSync'">
      <q-btn flat round dense>
        <more-vertical />
        <q-menu>
          <q-list style="min-width: 175px">
            <!-- Shutdown server -->
            <q-item v-close-popup clickable @click="onShutdownClick">
              <q-item-section>Turn Server Off</q-item-section>
              <q-item-section side>
                <power />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </toolbar>

    <p>CashierSync needs to be running and accessible.</p>
    <p>
      To run locally, install cashier-ledger sync server. Configure ledger
      with .ledgerrc in the user profile folder.
    </p>

    <h4 class="q-my-md text-center">Settings</h4>
    <div class="q-my-md row">
      <div class="col-8 q-py-md">
        <!-- server URL -->
        <q-input v-model="serverUrl" label="Server URL" @change="saveSyncServerUrl" />
      </div>
      <div class="col-4 text-center q-my-lg" style="align-self: center;">
        <div>
          <q-btn color="secondary" text-color="accent" @click="onConnectClicked">
            <Activity class="on-left" />
            Test
          </q-btn>
        </div>
      </div>
    </div>

    <q-separator />

    <div class="container">
      <h4 class="q-my-md text-center">Synchronization</h4>
      <q-list>
        <!-- Accounts -->
        <q-item>
          <q-item-section>
            <q-checkbox v-model="syncAccounts" label="Sync accounts list with balances." />
          </q-item-section>
          <q-item-label>
            <RefreshCw v-if="showAccountProgress" size="18" class="spin" />
          </q-item-label>
        </q-item>
        <!-- Asset Allocation values -->
        <q-item>
          <q-item-section>
            <q-checkbox v-model="syncAaValues"
              label="Sync account values in base currency (ledger b ^<root> -X <CUR> --flat --no-total). Used for asset allocation." />
          </q-item-section>
          <q-item-label>
            <RefreshCw v-if="showAssetProgress" size="18" class="spin" />
          </q-item-label>
        </q-item>
        <!-- Payees -->
        <q-item>
          <q-item-section>
            <q-checkbox v-model="syncPayees" label="Sync Payees." />
          </q-item-section>
          <q-item-label>
            <RefreshCw v-if="showPayeesProgress" size="18" class="spin" />
          </q-item-label>
        </q-item>
      </q-list>

      <div class="row q-my-lg">
        <div class="col text-center q-mt-sm">
          <q-btn color="accent" text-color="secondary" size="1.3rem" class="q-my-lg q-mx-md" @click="onSyncClicked">
            <refresh-cw size="30" stroke-width="3" class="on-left" />
            Sync
          </q-btn>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import appService from '../appService'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings, Constants } from '../lib/settings'
import Toolbar from '../components/CashierToolbar.vue'
import useNotifications from 'src/lib/CashierNotification'
import CashierDal from '../store/dal'
import { Activity, MoreVertical, Power, RefreshCw } from 'lucide-vue-next'

// const router = useRouter()
const Notification = useNotifications()

// data
const serverUrl = ref('http://localhost:8080') // the default value
const rootInvestmentAccount = ref(null)
const currency = ref(null)

const syncAccounts = ref(true)
const syncAaValues = ref(true)
const syncPayees = ref(true)
const showAccountProgress = ref(false)
const showPayeesProgress = ref(false)
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

  // checkboxes
  syncAccounts.value = await settings.get(SettingKeys.syncAccounts)
  syncAaValues.value = await settings.get(SettingKeys.syncAaValues)
  syncPayees.value = await settings.get(SettingKeys.syncPayees)
}

async function onConnectClicked() {
  const sync = new CashierSync(serverUrl.value)
  try {
    const response = await sync.healthCheck()

    Notification.positive(response)
  } catch (error: any) {
    console.error(error)
    Notification.negative('Connecting to CashierSync: ' + error.message)
  }
}

function onShutdownClick() {
  Notification.neutral('sending shutdown request')

  let sync = new CashierSync(serverUrl.value)
  sync.shutdown()

  // refresh the page to update the server status?
  //window.location.reload(true)
}

async function saveSyncServerUrl() {
  // sync server.
  await settings.set(SettingKeys.syncServerUrl, serverUrl.value)

  Notification.info('sync server saved')
}

async function synchronizeAaValues() {
  const sync = new CashierSync(serverUrl.value)
  try {
    await sync.readCurrentValues()

    Notification.positive('Asset Allocation values loaded')
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }
}

/**
 * Download the List of Accounts.
 */
async function synchronizeAccounts() {
  const sync = new CashierSync(serverUrl.value)

  const report = await sync.readAccounts()
  if (!report || report.length == 0) {
    Notification.negative('Invalid response received: ' + report)
    return
  }

  // delete all accounts only after we have retrieved the new ones.
  await appService.deleteAccounts()
  await appService.importBalanceSheet(report)

  Notification.positive('accounts fetched from Ledger')
}

async function onSyncClicked() {
  try {
    if (syncAccounts.value) {
      showAccountProgress.value = true
      await synchronizeAccounts()
      showAccountProgress.value = false
    }

    // Investment account balances in base currency, for Asset Allocation.
    if (syncAaValues.value) {
      showAssetProgress.value = true
      await synchronizeAaValues()
      showAssetProgress.value = false
    }

    if (syncPayees.value) {
      showPayeesProgress.value = true
      await synchronizePayees()
      showPayeesProgress.value = false
    }

    // Save the current sync choices
    await settings.set(SettingKeys.syncAccounts, syncAccounts.value)
    await settings.set(SettingKeys.syncAaValues, syncAaValues.value)
    await settings.set(SettingKeys.syncPayees, syncPayees.value)

  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)

    // reset all progress indicators
    showAccountProgress.value = false
    showPayeesProgress.value = false
    showAssetProgress.value = false
  }
}

async function synchronizePayees() {
  const sync = new CashierSync(serverUrl.value)

  const response = await sync.readPayees()

  if (!response || response.length == 0) {
    Notification.negative('Invalid response received: ' + response)
    return
  }

  // delete all payees only after we have retrieved the new ones.
  const dal = new CashierDal()
  await dal.deletePayees()

  await appService.importPayees(response)

  Notification.positive('Payees fetched from Ledger')
}

async function shutdown() {
  const sync = new CashierSync(serverUrl.value)
  try {
    await sync.shutdown()
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }

  Notification.neutral('The server shutdown request sent.')
}
</script>
