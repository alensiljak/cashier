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

const store = useStore()
const $q = useQuasar()
const mainStore = useMainStore()
const router = useRouter()

const { scheduledTx, tx } = mainStore

// computed

// const tx = computed({
//   get() {
//     return JSON.parse(scheduledTx.transaction)
//   },
//   set(value) {
//     scheduledTx.transaction = JSON.stringify(value)
//   },
// })

// provide

provide('scheduledTx', scheduledTx)
// provide('tx', tx)

// onCreated

// are we back from the select mode?
// if (store.state.selectModeMeta) {
//handleSelection()
// }

// methods

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
  let tempTx = toRaw(tx)
  // clear any transaction ids!
  tempTx.id = null
  const txStr = JSON.stringify(tempTx)

  let stx = toRaw(scheduledTx)
  stx.transaction = txStr

  // use transaction date.
  stx.nextDate = tx.date

  const result = await appService.saveScheduledTransaction(stx)
  return result
}

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
