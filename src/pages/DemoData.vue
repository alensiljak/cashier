<template>
  <q-page padding class="text-amber-2">
    <CashierToolbar title="Demo Data" />

    <div class="row">
      <p>Here you can create some default data as well as demo records that
        help illustrate how to use the application.</p>
    </div>

    <div class="row">
      <q-checkbox label="Create All" v-model="createAllChecked" @update:model-value="onAllClicked" />
      <Check v-if="progress.allDone" class="q-mt-sm on-right" />
    </div>

    <q-separator />

    <div class="row">
      <q-checkbox label="Create default Chact of Accounts" v-model="createAccountsChecked" />
      <Check v-if="progress.accounts" class="q-mt-sm on-right" />
    </div>

    <div class="row">
      <q-checkbox label="Create default settings" v-model="createDefaultSettingsChecked" />
      <Check v-if="progress.defaultSettings" class="q-mt-sm on-right" />
    </div>

    <div class="row">
      <q-checkbox label="Create demo investment accounts" v-model="createInvestmentAccountsChecked" />
      <Check v-if="progress.investmentAccounts" class="q-mt-sm on-right" />
    </div>

    <div class="row">
      <q-checkbox label="Create demo Account balances" v-model="createAccountBalancesChecked" />
      <Check v-if="progress.balances" class="q-mt-sm on-right" />
    </div>

    <div class="row">
      <q-checkbox label="Create favourite accounts" v-model="createFavAccountsChecked" />
      <Check v-if="progress.favourites" class="q-mt-sm on-right" />
    </div>

    <div class="row">
      <q-checkbox label="Create Payees" v-model="createPayeesChecked" />
      <Check v-if="progress.payees" class="q-mt-sm on-right" />
    </div>

    <div class="row">
      <q-checkbox label="Create Transactions" v-model="createTxChecked" />
      <Check v-if="progress.payees" class="q-mt-sm on-right" />
    </div>
    <div class="row">
      <p>TODO: Create Scheduled Transactions</p>
    </div>

    <div class="row">
      <q-checkbox label="Create Asset Allocation" v-model="createAssetAllocationChecked" />
      <Check v-if="progress.assetAllocation" class="q-mt-sm on-right" />
    </div>

    <!-- button -->
    <div class="row justify-center">
      <q-btn color="secondary" text-color="accent" label="Create" @click="create" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CashierToolbar from 'src/components/CashierToolbar.vue'
import { ref } from 'vue'
import useNotifications from 'src/lib/CashierNotification'
import { AccountService } from 'src/lib/accountsService'
import { SettingKeys, settings } from '../lib/settings'
import {
  createPayees, createAccountBalances, createAssetAllocation,
  createInvestmentAccounts, createTransactions
} from '../lib/demoDataGenerator'
import { Check } from 'lucide-vue-next'

const Notification = useNotifications()

const createAllChecked = ref(true)
const createAccountsChecked = ref(true)
const createInvestmentAccountsChecked = ref(true)
const createAccountBalancesChecked = ref(true)
const createDefaultSettingsChecked = ref(true)
const createFavAccountsChecked = ref(true)
const createPayeesChecked = ref(true)
const createTxChecked = ref(true)
const createAssetAllocationChecked = ref(true)
const progress = ref({
  allDone: false,
  accounts: false,
  defaultSettings: false,
  investmentAccounts: false,
  balances: false,
  favourites: false,
  payees: false,
  transactions: false,
  assetAllocation: false
})

async function create() {
  // create records
  if (createAccountsChecked.value) {
    await confirmCreateAccounts()
    progress.value.accounts = true
  }

  if (createInvestmentAccountsChecked.value) {
    await createInvestmentAccounts()
    progress.value.investmentAccounts = true
  }

  if (createAccountBalancesChecked.value) {
    await createAccountBalances()
    progress.value.balances = true
  }

  if (createDefaultSettingsChecked.value) {
    await createDefaultSettings()
    progress.value.defaultSettings = true
  }

  if (createFavAccountsChecked.value) {
    await createFavouriteAccounts()
    progress.value.favourites = true
  }

  if (createPayeesChecked.value) {
    await createPayees()
    progress.value.payees = true
  }

  if (createTxChecked.value) {
    await createTransactions();
    progress.value.transactions = true
  }

  if (createAssetAllocationChecked.value) {
    await createAssetAllocation()
    progress.value.assetAllocation = true
  }

  progress.value.allDone = true
}

function onAllClicked() {
  const checked = createAllChecked.value

  createAccountsChecked.value = checked
  createInvestmentAccountsChecked.value = checked
  createAccountBalancesChecked.value = checked
  createDefaultSettingsChecked.value = checked
  createFavAccountsChecked.value = checked
  createPayeesChecked.value = checked
  createTxChecked.value = checked

  createAssetAllocationChecked.value = checked
}

async function confirmCreateAccounts() {
  //
  if (haveExistingData()) {
    // todo: prompt
  }

  // No confirmation at the moment. Create chart of accounts.
  await createAccounts()
}

async function createAccounts() {
  try {
    //  create demo chart of Accounts.
    await new AccountService().createDefaultAccounts()
  } catch (error: any) {
    console.error(error.message)
    Notification.negative(error.message)
  }
}

async function createDefaultSettings() {
  await settings.set(SettingKeys.dbInitialized, true)
  await settings.set(SettingKeys.currency, 'EUR')
  await settings.set(SettingKeys.rootInvestmentAccount, 'Assets:Investment')

  await settings.set(SettingKeys.syncServerUrl, 'http://localhost:3000')
}

async function createFavouriteAccounts() {
  const favArray = ['Assets:Cash', 'Assets:Bank Accounts:Checking']
  await settings.set(SettingKeys.favouriteAccounts, favArray)
}

function haveExistingData(): boolean {
  // todo: check if there is existing data in the destination table.

  return false
}
</script>