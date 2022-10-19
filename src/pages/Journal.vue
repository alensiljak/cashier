<template>
  <q-page padding class="text-colour2">
    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" icon="menu" @click="menuClicked" />

        <q-toolbar-title>Device Journal</q-toolbar-title>

        <!-- <q-btn flat round dense icon="sim_card" class="q-mr-xs" /> -->
        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 175px">
              <!-- dense -->
              <q-item v-close-popup clickable>
                <q-item-section @click="exportJournal">Export</q-item-section>
                <q-item-section side>
                  <file-down />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onDeleteAllClicked">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <trash2 />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-slide-item v-for="tx in transactions" :key="tx.id" right-color="secondary" @right="onSlide">
      <template #right>
        <div class="row items-center text-accent" @click="deleteTransaction(tx.id)">
          Click to confirm or wait 2s to cancel
          <trash2 class="on-right" />
        </div>
      </template>

      <journal-transaction :tx="tx" @click.once="onTxClick(tx.id)" />
    </q-slide-item>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="openNewTransaction">
        <q-icon name="add" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog v-model="confirmDeleteVisible" persistent content-class="bg-blue-grey-10">
      <q-card class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn v-close-popup flat label="Delete" color="accent" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- delete all dialog -->
    <q-dialog v-model="confirmDeleteAllVisible" persistent content-class="bg-blue-grey-10">
      <q-card class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete all transactions?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn v-close-popup flat label="Delete" color="accent" @click="confirmDeleteAll" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/mainStore'
import appService from '../appService'
import JournalTransaction from '../components/JournalTransaction.vue'
import { Transaction } from 'src/model'
import { FileDown, Trash2 } from 'lucide-vue-next'

const $q = useQuasar()
const router = useRouter()
const mainStore = useMainStore()

// data

const confirmDeleteAllVisible = ref(false)
const transactions: Ref<Transaction[]> = ref([])
const confirmDeleteVisible = ref(false)

let resetSlide: any = null
let timer = null

const errorMessage = { color: 'secondary', message: '' }

// mounted

onMounted(async () => {
  //
  await loadData()
})

// methods

async function confirmDelete() {
  await deleteTransaction()
}

function confirmDeleteAll() {
  deleteAllTransactions()
}

/**
 * delete all transactions
 */
async function deleteAllTransactions() {
  try {
    await appService.deleteTransactions()
    $q.notify({ message: 'transactions deleted' })

    await loadData()
  } catch (error) {
    console.error(error)
    $q.notify({ message: error, color: 'danger' })
  }
}

async function deleteTransaction(id: number) {
  if (!id) {
    $q.notify({
      color: 'negative',
      message: 'No transaction id sent for deletion.',
    })
  }

  // remove the reset reference.
  if (resetSlide) {
    // remove the slide section.
    resetSlide()
    resetSlide = null
  }

  try {
    const result = await appService.deleteTransaction(id)
    // console.debug('delete result:', result)
    $q.notify({ message: 'Transaction deleted', color: 'positive' })

    await loadData()
  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: error.message })
  }
}

function exportJournal() {
  router.push({ name: 'export' })
}

function finalize(reset: any) {
  timer = setTimeout(() => {
    // has it been already deleted?
    if (!resetSlide) return

    reset()
  }, 2000)
}

function onSlide({ reset }) {
  resetSlide = reset
  finalize(reset)
}

async function loadData() {
  // load all transactions
  try {
    transactions.value = await appService.db.transactions
      .orderBy('date')
      .reverse()
      .toArray()
  } catch (error: any) {
    console.error(error)
    errorMessage.message = error.message
    $q.notify(errorMessage)
  }
}

function menuClicked() {
  mainStore.toggleDrawer()
}

function onDeleteAllClicked() {
  confirmDeleteAllVisible.value = true
}

function onTransactionDeleteClicked(data) {
  // confirm
  confirmDeleteVisible.value = true
  // transactionIdToDelete.value = data.id
}

async function onTxClick(id: number) {
  if (typeof id !== 'number') {
    $q.notify({
      message: 'The id (' + id + ') is not numeric! Try again.',
      color: 'negative',
    })
  }

  // load tx
  await mainStore.loadTx(id)

  await router.push({ name: 'tx-actions', params: { id: id } })
}

function openNewTransaction() {
  mainStore.newTx()

  router.push({ name: 'tx' })
}
</script>
