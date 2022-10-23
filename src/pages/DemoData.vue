<template>
  <q-page padding class="text-amber-2">
    <CashierToolbar title="Demo Data" />

    <p>Incomplete !</p>

    <div class="row">
      <p>Here you will be able to create demo data.</p>
    </div>

    <div class="row">
      <q-checkbox label="Create All" v-model="createAllChecked" @update:model-value="onAllClicked" />
    </div>
    <q-separator />
    <div class="row">
      <q-checkbox label="Create Accounts" v-model="createAccountsChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create demo Account balances" v-model="createAccountBalancesChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create default settings" v-model="createDefaultSettingsChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create favourite accounts" v-model="createFavAccountsChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create Payees" v-model="createPayeesChecked" />
    </div>
    <div class="row">
      <p>TODO: Create Transactions</p>
    </div>
    <div class="row">
      <p>TODO: Create Scheduled Transactions</p>
    </div>
    <div class="row">
      <q-checkbox label="Create Asset Allocation" v-model="createAssetAllocationChecked" />
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
// import appService from 'src/appService';
import { SettingKeys, settings } from '../lib/settings'
import { createPayees, createAccountBalances, createAssetAllocation } from '../lib/demoDataGenerator'

const Notification = useNotifications()

const createAllChecked = ref(true)
const createAccountsChecked = ref(true)
const createAccountBalancesChecked = ref(true)
const createDefaultSettingsChecked = ref(true)
const createFavAccountsChecked = ref(true)
const createPayeesChecked = ref(true)
const createAssetAllocationChecked = ref(true)

async function create() {
  // create records
  if (createAccountsChecked.value) {
    await confirmCreateAccounts()
  }
  if (createAccountBalancesChecked.value) {
    await createAccountBalances()
    Notification.positive('Demo account balances created.')
  }
  if (createDefaultSettingsChecked.value) {
    await createDefaultSettings()
  }
  if (createFavAccountsChecked.value) {
    await createFavouriteAccounts()
  }
  if (createPayeesChecked.value) {
    await createPayees()
    Notification.positive('Payees created')
  }

  if (createAssetAllocationChecked.value) {
    await createAssetAllocation()
    Notification.positive('Asset Allocation created')
  }
}

function onAllClicked() {
  const checked = createAllChecked.value

  createAccountsChecked.value = checked
  createAccountBalancesChecked.value = checked
  createDefaultSettingsChecked.value = checked
  createFavAccountsChecked.value = checked
  createPayeesChecked.value = checked

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
    Notification.positive('Chart of Accounts created')
  } catch (error: any) {
    console.error(error.message)
    Notification.negative(error.message)
  }
}

async function createDefaultSettings() {
  await settings.set(SettingKeys.dbInitialized, true)
  await settings.set(SettingKeys.currency, 'EUR')
  await settings.set(SettingKeys.rootInvestmentAccount, 'Assets:Investment')

  await settings.set(SettingKeys.syncServerUrl, 'http://localhost:8080')

  Notification.positive('Default settings created')
}

async function createFavouriteAccounts() {
  const favArray = ['Assets:Cash', 'Assets:Bank Accounts:Checking']
  await settings.set(SettingKeys.favouriteAccounts, favArray)

  Notification.positive('Favourite Accounts created')
}

function haveExistingData(): boolean {
  // todo: check if there is existing data in the destination table.

  return false
}
</script>