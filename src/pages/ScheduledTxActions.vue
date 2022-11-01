<template>
  <q-page padding class="text-amber-2">
    <toolbar title="Scheduled Transaction Actions" />

    <journal-transaction :tx="tx" />

    <div class="q-pt-sm">
      <span v-if="scheduledTx.count">
        Repeats every {{ scheduledTx.count }} {{ scheduledTx.period }}
      </span>
      <span v-if="scheduledTx.endDate"> until {{ scheduledTx.endDate }}</span>
    </div>

    <!-- Remarks -->
    <div class="q-pt-sm">
      {{ scheduledTx.remarks }}
    </div>

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Enter -->
      <q-btn color="accent" text-color="secondary" size="1.3rem" class="q-my-lg q-mx-md"
        @click="enterConfirmationVisible = true">
        <icon-scroll size="32" class="on-left" />
        Enter
      </q-btn>
      <!-- Skip -->
      <q-btn color="primary" text-color="accent" size="1.3rem" class="q-my-lg q-mx-md"
        @click="skipConfirmationVisible = true">
        <chevrons-right size="32" class="on-left" />
        Skip
      </q-btn>
      <!-- Edit -->
      <q-btn color="accent" text-color="secondary" size="1.3rem" class="q-my-lg q-mx-md" @click="onEditClicked">
        <icon-edit size="32" class="on-left" />
        Edit
      </q-btn>
      <!-- Delete -->
      <q-btn color="secondary" text-color="accent" size="1.3rem" class="q-my-lg q-mx-md"
        @click.once="confirmDeleteVisible = true">
        <trash2 size="32" class="on-left" />
        Delete
      </q-btn>
    </div>
    <div id="dialogs">
      <!-- 'Skip' confirmation dialog -->
      <q-dialog v-model="skipConfirmationVisible" persistent content-class="bg-blue-grey-10">
        <q-card class="bg-primary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to skip the next iteration?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn v-close-popup flat label="Yes" color="accent" @click="onSkipConfirmed" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- confirm stx deletion dialog -->
      <q-dialog v-model="confirmDeleteVisible" persistent content-class="bg-blue-grey-10">
        <q-card class="bg-secondary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to delete the scheduled transaction
              {{ tx.payee }}?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="Cancel" color="accent" />
            <q-btn v-close-popup flat label="Delete" color="accent" @click="confirmDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- 'Enter' confirmation dialog -->
      <q-dialog v-model="enterConfirmationVisible" persistent content-class="bg-blue-grey-10">
        <q-card class="bg-primary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to enter this transaction into the journal?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn v-close-popup flat label="Yes" color="accent" @click="onEnterConfirmed" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, Ref, ref, toRaw, toRefs } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import Toolbar from '../components/CashierToolbar.vue'
import JournalTransaction from '../components/JournalTransaction.vue'
import appService from '../appService'
import { Iterator } from '../lib/scheduledTransactions'
import { storeToRefs } from 'pinia'
import { ScheduledTransaction, Transaction } from 'src/model'
import CashierDAL from '../store/dal'
import { ChevronsRight, Edit as IconEdit, Scroll as IconScroll, Trash2 } from 'lucide-vue-next'

const mainStore = useMainStore()
const $q = useQuasar()
// const route = useRoute()
const router = useRouter()
const { scheduledTx, tx } = storeToRefs(mainStore)
const dal = new CashierDAL()

const props = defineProps({
  id: { type: String, default: null },
})

if (!scheduledTx.value) {
  scheduledTx.value = {}
}

/*
  data
*/
let enterConfirmationVisible = ref(false)
const skipConfirmationVisible = ref(false)
const confirmDeleteVisible = ref(false)

// Methods

/**
 * enter the transaction into journal and update the next date on schedule.
 */
async function enterTransaction() {
  // Create the journal transaction.
  let newTx: Transaction = toRaw(tx.value)
  // clear the id field, if any, to get a new one on save.
  newTx.id = undefined
  const id = await dal.saveTransaction(newTx)

  // update the iteration date
  await skip()

  $q.notify({ message: 'Transaction created', color: 'positive' })

  // load transaction into store
  await mainStore.loadTx(id)

  // open the transaction. Maintain page navigation history.
  router.replace({ name: 'tx', params: { id: id } })
}

function getNumericId() {
  // when navigating back, the id becomes string instead of original numeric
  const id = props.id

  if (typeof id === 'string') {
    return Number(id)
  }
  if (typeof id === 'number') {
    return id
  }

  throw new Error('Invalid Id value', id)
}

async function confirmDelete() {
  const id = scheduledTx.value.id
  if (!id) {
    console.error('the current scheduled transaction does not have an id')
    return
  }

  const result = await appService.db.scheduled.where('id').equals(id).delete()
  console.log('deletion result:', result)

  //this.resetTransaction()

  router.back()
}

function onEditClicked() {
  // open the editor
  const id = getNumericId()
  router.push({ name: 'scheduledtxeditor', params: { id: id } })
}

async function onEnterConfirmed() {
  try {
    await enterTransaction()
  } catch (error: any) {
    console.error(error)
    $q.notify({ color: 'negative', message: error.message })
  }
}

async function onSkipConfirmed() {
  try {
    await skip()

    router.back()
  } catch (error: any) {
    console.error(error)
    $q.notify({ color: 'negative', message: error.message })
  }
}

/**
 * Saves the Scheduled Transaction record.
 */
async function saveData() {
  let raw = toRaw(scheduledTx.value) as ScheduledTransaction
  const result = await dal.saveScheduledTransaction(raw)
  return result
}

/**
 * Skips the next iteration.
 */
async function skip() {
  let stx: Ref<ScheduledTransaction> = scheduledTx as Ref<ScheduledTransaction>
  if (!stx.value) {
    throw new Error('The scheduled transaction reference is invalid!')
  }

  const startDate = stx.value.nextDate
  const count = stx.value.count
  const period = stx.value.period
  const endDate = stx.value.endDate

  validateSchedule(stx.value)

  // todo: handle the one-off occurrence (no count and no period)

  // calculate the next iteration.
  const iterator = new Iterator()
  let newDate = iterator.calculateNextIteration(
    startDate,
    count,
    period,
    endDate
  )
  if (!newDate) {
    // throw new Error(`invalid date calculated: ${newDate}`)
    // Passed the End Date.
    newDate = '0000-00-00'
  }

  // update the date on the transaction
  let templateTx = toRaw(tx.value) as Transaction
  templateTx.date = newDate
  stx.value.transaction = templateTx
  //tx.value = templateTx

  stx.value.nextDate = tx.value?.date

  const result = await saveData()
  if (!result) {
    $q.notify({
      message: 'transaction not saved!',
      color: 'negative',
    })
  }
}

function validateSchedule(schTx: ScheduledTransaction) {
  // A schedule can't have no repetitions and no end. Skipping the date would result
  // in an invalid situation.
  if (!schTx.endDate && !(schTx.count || schTx.period)) {
    throw new Error('A schedule must have either an end date or a repetition pattern.')
  }
}
</script>
