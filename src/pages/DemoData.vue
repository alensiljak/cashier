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
      <q-checkbox label="Create default settings" v-model="createDefaultSettingsChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create Accounts" v-model="createAccountsChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create Favourite Accounst" v-model="createFavAccountsChecked" />
    </div>
    <div class="row">
      <q-checkbox label="Create Payees" v-model="createPayeesChecked" />
    </div>
    <p>Create Transactions</p>
    <p>Create Scheduled Transactions</p>
    <p>Create Asset Allocation</p>

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
import { createDemoPayees } from '../lib/demoDataGenerator'

const Notification = useNotifications()

const createAllChecked = ref(true)
const createDefaultSettingsChecked = ref(true)
const createAccountsChecked = ref(true)
const createFavAccountsChecked = ref(true)
const createPayeesChecked = ref(true)

async function create() {
  // create records
  if (createAccountsChecked.value) {
    await confirmCreateAccounts()
  }
  if (createDefaultSettingsChecked.value) {
    await createDefaultSettings()
  }
  if (createFavAccountsChecked.value) {
    await createFavouriteAccounts()
  }
  if (createPayeesChecked.value) {
    createPayees()
  }
}

function onAllClicked() {
  const checked = createAllChecked.value

  createAccountsChecked.value = checked
  createDefaultSettingsChecked.value = checked
  createFavAccountsChecked.value = checked
  createPayeesChecked.value = checked
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

async function createPayees() {
  await createDemoPayees()
  Notification.positive('Payees created')
}

function haveExistingData(): boolean {
  // todo: check if there is existing data in the destination table.

  return false
}
</script>