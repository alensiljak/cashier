<template>
  <q-page padding class="text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title>Scheduled Transaction Edit</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <tx-editor />

    <q-separator class="q-my-lg" />

    <schedule-editor />

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <q-icon name="done" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import TxEditor from '../components/TransactionEditor.vue'
import ScheduleEditor from '../components/ScheduleEditor.vue'
import { computed, onMounted, provide } from 'vue'
import { toRaw } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import appService from '../appService'
import { useMainStore } from '../store/mainStore'
import CashierDAL from '../store/dal'
import { ScheduledTransaction, Transaction } from 'src/model'

const store = useStore()
const $q = useQuasar()
const mainStore = useMainStore()
const router = useRouter()
const dal = new CashierDAL()

const { scheduledTx, tx } = mainStore

// provide

provide('scheduledTx', scheduledTx)
// provide('tx', tx)

// onCreated

// are we back from the select mode?
// if (store.state.selectModeMeta) {
//handleSelection()
// }

// methods

async function onFabClicked() {
  await onSaveClicked()
}

async function onSaveClicked() {
  const result = await saveData()

  if (result) {
    await router.back()
  }
}

function resetTransaction() {
  mainStore.newScheduledTx()
}

/**
 * Saves the scheduled transaction to the data store.
 */
async function saveData() {
  // serialize transaction
  let tempTx = toRaw(tx) as Transaction
  // clear any transaction ids!
  tempTx.id = undefined
  //const txStr = JSON.stringify(tempTx)

  let stx = toRaw(scheduledTx) as ScheduledTransaction
  //stx.transaction = txStr
  stx.transaction = tempTx

  // use transaction date.
  stx.nextDate = tx.date

  const result = await dal.saveScheduledTransaction(stx)
  return result
}

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
