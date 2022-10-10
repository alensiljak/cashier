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
    <div class="row">
      <q-checkbox label="Create Accounts" v-model="createAccountsChecked" />
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

const Notification = useNotifications()

const createAllChecked = ref(false)
const createAccountsChecked = ref(false)

async function create() {
  // create records
  if (createAccountsChecked.value) {
    await confirmCreateAccounts()
  }

}

function onAllClicked() {
  //console.log('all toggle', createAllChecked.value)

  const checked = createAllChecked.value

  createAccountsChecked.value = checked
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
    Notification.positive('Chart of Accounst created')
  } catch (error: any) {
    console.error(error.message)
    Notification.negative(error.message)
  }
}

function haveExistingData(): boolean {
  // todo: check if there is existing data in the destination table.

  return false
}
</script>