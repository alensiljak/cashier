<template>
  <q-page padding class="text-amber-2">
    <toolbar title="Transaction Actions" />

    <journal-transaction :tx="tx" />

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Edit -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click.once="onEditClicked"
      >
        <font-awesome-icon
          icon="save"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Edit
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onDuplicateClicked"
      >
        <font-awesome-icon
          icon="copy"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Duplicate
      </q-btn>
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onScheduleClick"
      >
        <font-awesome-icon
          icon="calendar-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Schedule
      </q-btn>
      <q-btn
        v-if="$store.getters.liveModeOn"
        size="1.3rem"
        color="primary"
        text-color="accent"
        class="q-my-lg q-mx-md"
        @click="onXactClicked"
      >
        <font-awesome-icon
          icon="scroll"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        xact
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onCopyClicked"
      >
        <font-awesome-icon
          icon="copy"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        copy ledger entry
      </q-btn>
      <q-btn
        v-if="tx && tx.id"
        color="secondary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onDeleteClick"
      >
        <font-awesome-icon
          icon="trash-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Delete
      </q-btn>
    </div>

    <!-- confirm tx deletion dialog -->
    <q-dialog
      v-model="confirmDeleteVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="accent"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, toRefs } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useRouter } from 'vue-router'
import appService from '../appService'
import { useQuasar } from 'quasar'
import Toolbar from '../components/CashierToolbar.vue'
import JournalTransaction from '../components/JournalTransaction.vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
const $q = useQuasar()
const mainStore = useMainStore()
const { tx } = storeToRefs(mainStore)

//provide('tx', tx)

// data

const confirmDeleteVisible = ref(false)

// props

const props = defineProps({ id: { type: String, default: null } })
const { id } = toRefs(props)
// console.debug('id', id.value, 'tx:', tx)

onMounted(async () => {
  const numId = Number(id.value)

  if (!tx.value || tx.value.id !== numId) {
    await mainStore.loadTx(id.value)
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
  } catch (reason) {
    $q.notify({ message: reason.message, color: 'negative' })
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
    const id = await appService.saveTransaction(newTx)

    // display a notification after or ask before the action.
    $q.notify({ color: 'positive', message: 'Transaction duplicated' })

    // load the new tx for editing
    await mainStore.loadTx(id)

    // navigate to the editor for the new transaction,
    // resetting the navigation?
    await router.replace({ name: 'tx', params: { id: id } })
  } catch (err) {
    console.error(err)
    $q.notify({ color: 'negative', message: err.message })
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
  tx.id = null

  router.push({ name: 'scheduledtxeditor', params: { id: 0 } })
}

function onXactClicked() {
  router.push({ name: 'xact', params: { payee: tx.payee } })
}
</script>

<style lang="sass" scoped>
.large-button
  width: 90%
</style>
