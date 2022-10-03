<template>
  <q-page padding class="text-amber-2">
    <CashierToolbar title="Demo Data" />

    <p>Incomplete !</p>

    <div class="row">
      <p>Here you will be able to create demo data.</p>
    </div>

    <div class="row">
      <q-checkbox
        label="Create All"
        v-model="createAllChecked"
        @update:model-value="onAllClicked"
      />
    </div>
    <div class="row">
      <q-checkbox label="Create Accounts" v-model="createAccountsChecked" />
    </div>
    <p>Create Transactions</p>
    <p>Create Scheduled Transactions</p>
    <p>Create Asset Allocation</p>

    <!-- button -->
    <div class="row justify-center">
      <q-btn
        color="secondary"
        text-color="accent"
        label="Create"
        @click="create"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CashierToolbar from 'src/components/CashierToolbar.vue'
import { ref } from 'vue'
import useNotifications from 'src/lib/CashierNotification'

const Notification = useNotifications()

const createAllChecked = ref(false)
const createAccountsChecked = ref(false)

function create() {
  // create records
  if (createAccountsChecked.value) {
    confirmCreateAccounts()
  }

  Notification.info('not (yet) implemented')
}

function onAllClicked() {
  console.log('all toggle', createAllChecked.value)

  createAccountsChecked.value = createAllChecked.value
}

function confirmCreateAccounts() {
  //
  if (haveExistingData()) {
    // todo: prompt
  }
}

function createAccounts() {
  // todo: create demo chart of Accounts.
}

function haveExistingData(): boolean {
  // todo: check if there is existing data in the destination table.

  return false
}
</script>