<template>
  <q-page padding class="text-amber-2">
    <toolbar title="Transaction Actions" />

    <journal-transaction :tx="tx" />

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Edit -->
      <q-btn color="accent" text-color="secondary" size="1.3rem" class="q-my-lg q-mx-md" @click.once="onEditClicked">
        <icon-edit size="32" class="on-left" />
        Edit
      </q-btn>
      <q-btn color="primary" text-color="accent" size="1.3rem" class="q-my-lg q-mx-md" @click="onDuplicateClicked">
        <icon-copy size="32" class="on-left" />
        Duplicate
      </q-btn>
      <q-btn color="accent" text-color="secondary" size="1.3rem" class="q-my-lg q-mx-md" @click="onScheduleClick">
        <calendar-clock size="32" class="on-left" />
        Schedule
      </q-btn>
      <q-btn v-if="$store.getters.liveModeOn" size="1.3rem" color="primary" text-color="accent" class="q-my-lg q-mx-md"
        @click="onXactClicked">
        <icon-scroll size="32" class="on-left" />
        xact
      </q-btn>
      <q-btn color="primary" text-color="accent" size="1.3rem" class="q-my-lg q-mx-md" @click="onCopyClicked">
        <clipboard-copy size="32" class="on-left" />
        copy ledger entry
      </q-btn>
      <q-btn v-if="tx && tx.id" color="secondary" text-color="accent" size="1.3rem" class="q-my-lg q-mx-md"
        @click="onDeleteClick">
        <icon-trash2 size="32" class="on-left" />
        Delete
      </q-btn>
    </div>

    <!-- confirm tx deletion dialog -->
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
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, provide, Ref, ref, toRefs } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useRouter } from 'vue-router'
import appService from '../appService'
import { useQuasar } from 'quasar'
import Toolbar from '../components/CashierToolbar.vue'
import JournalTransaction from '../components/JournalTransaction.vue'
import { storeToRefs } from 'pinia'
import { Transaction } from 'src/model'
import CashierDAL from '../store/dal'
import {
  CalendarClock, ClipboardCopy, Copy as IconCopy, Edit as IconEdit, Save as IconSave,
  Scroll as IconScroll, Trash2 as IconTrash2
} from 'lucide-vue-next'

const router = useRouter()
const $q = useQuasar()
const mainStore = useMainStore()
const { tx }: { tx: Ref<Transaction> } = storeToRefs(mainStore)
const dal = new CashierDAL()

//provide('tx', tx)

// data

const confirmDeleteVisible = ref(false)

// props

const props = defineProps({ id: { type: String, default: null } })
const { id } = toRefs(props)

onMounted(async () => {
  const numId = Number(id.value)

  if (!tx.value || tx.value.id !== numId) {
    await mainStore.loadTx(numId)
  }
})

/**
 * The user confirmed the deletion.
 */
async function confirmDelete() {
  await deleteTransaction()

  await router.back()
}

async function deleteTransaction() {
  const id = getNumericId()

  try {
    await appService.deleteTransaction(id)

    mainStore.setTransaction(null)

    $q.notify({ message: 'Transaction deleted', color: 'positive' })
  } catch (error: any) {
    console.error(error)
    $q.notify({ message: error.message, color: 'negative' })
  }
}

function getNumericId() {
  // when navigating back, the id becomes string instead of original numeric
  if (typeof props.id === 'string') {
    return Number(props.id)
  }
  if (typeof props.id === 'number') {
    return props.id
  }

  throw new Error('Invalid Id value')
}

async function onCopyClicked() {
  // get a journal version
  const text = await appService.translateToLedger(tx.value)

  // copy to clipboard
  await navigator.clipboard.writeText(text)

  $q.notify({
    message: 'transaction copied to clipboard',
    color: 'positive',
  })
}

function onDeleteClick() {
  // show the confirmation dialog.
  confirmDeleteVisible.value = true
}

async function onDuplicateClicked() {
  try {
    // create the transaction
    const newTx = await appService.duplicateTransaction(tx.value)
    // save
    const id = await dal.saveXact(newTx)

    // display a notification after or ask before the action.
    $q.notify({ color: 'positive', message: 'Transaction duplicated' })

    // load the new tx for editing
    await mainStore.loadTx(id)

    // navigate to the editor for the new transaction,
    // resetting the navigation?
    await router.replace({ name: 'tx', params: { id: id } })
  } catch (error: any) {
    console.error(error)
    $q.notify({ color: 'negative', message: error.message })
    return
  }
}

function onEditClicked() {
  const id = getNumericId()
  router.push({ name: 'tx', params: { id: id } })
}

function onScheduleClick() {
  // the journal transaction stays in the store and is available in the sch.tx editor.
  mainStore.newScheduledTx()

  // clear the tx id
  tx.value.id = undefined

  router.push({ name: 'scheduledtxeditor', params: { id: 0 } })
}

function onXactClicked() {
  router.push({ name: 'xact', params: { payee: tx.value.payee } })
}
</script>

<style lang="sass" scoped>
.large-button
  width: 90%
</style>
