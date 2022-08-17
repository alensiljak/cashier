<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar title="Scheduled Transaction Actions" />

    <journal-transaction :tx="tx" />

    <div class="q-pt-sm">
      <span v-if="scheduledTx.count">
        Repeats every {{ scheduledTx.count }} {{ scheduledTx.period }}
      </span>
      <span v-if="scheduledTx.endDate">until {{ scheduledTx.endDate }}</span>
    </div>

    <!-- Remarks -->
    <div class="q-pt-sm">
      {{ scheduledTx.remarks }}
    </div>

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Enter -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="enterConfirmationVisible = true"
      >
        <font-awesome-icon
          icon="scroll"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Enter
      </q-btn>
      <!-- Skip -->
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="skipConfirmationVisible = true"
      >
        <font-awesome-icon
          icon="forward"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Skip
      </q-btn>
      <!-- Edit -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onEditClicked"
      >
        <font-awesome-icon
          icon="save"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Edit
      </q-btn>
      <!-- Delete -->
      <q-btn
        color="secondary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click.once="confirmDeleteVisible = true"
      >
        <font-awesome-icon
          icon="trash-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Delete
      </q-btn>
    </div>
    <div id="dialogs">
      <!-- 'Skip' confirmation dialog -->
      <q-dialog
        v-model="skipConfirmationVisible"
        persistent
        content-class="bg-blue-grey-10"
      >
        <q-card dark class="bg-primary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to skip the next iteration?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn
              v-close-popup
              flat
              label="Yes"
              color="accent"
              @click="onSkipConfirmed"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- confirm stx deletion dialog -->
      <q-dialog
        v-model="confirmDeleteVisible"
        persistent
        content-class="bg-blue-grey-10"
      >
        <q-card dark class="bg-secondary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to delete the scheduled transaction?</span>
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
      <!-- 'Enter' confirmation dialog -->
      <q-dialog
        v-model="enterConfirmationVisible"
        persistent
        content-class="bg-blue-grey-10"
      >
        <q-card dark class="bg-primary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to enter this transaction into the journal?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn
              v-close-popup
              flat
              label="Yes"
              color="accent"
              @click="onEnterConfirmed"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script setup>
import { computed, ref, toRaw } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

const mainStore = useMainStore()
const $q = useQuasar()
// const route = useRoute()
const router = useRouter()
//const { tx } = mainStore

const props = defineProps({
  id: { type: String, default: null },
})

const { scheduledTx } = mainStore
const tx = computed({
  get() {
    return JSON.parse(scheduledTx.transaction)
  },
  set(value) {
    scheduledTx.transaction = JSON.stringify(value)
  },
})

// data
let enterConfirmationVisible = ref(false)

// onCreate
// if (!scheduledTx && route.params.id) {
//   mainStore.loadScheduledTx(route.params.id)
// }

// Methods

/**
 * enter the transaction into journal and update the next date on schedule.
 */
async function enterTransaction() {
  // Create the journal transaction.
  let newTx = tx.value
  // clear the id field, if any, to get a new one on save.
  newTx.id = null
  const id = await appService.saveTransaction(newTx)

  await mainStore.loadTx(id)

  // update the iteration date
  await skip()

  $q.notify({ message: 'Transaction created', color: 'positive' })

  // open the transaction. Maintain page navigation history.
  router.replace({ name: 'tx', params: { id: id } })
}

async function onEnterConfirmed() {
  try {
    await enterTransaction()
  } catch (err) {
    $q.notify({ color: 'negative', message: err.message })
  }
}

/**
 * Saves the Scheduled Transaction record.
 */
async function saveData() {
  let raw = toRaw(scheduledTx)
  const result = await appService.saveScheduledTransaction(raw)
  return result
}

async function skip() {
  // Skips the next iteration.

  let stx = scheduledTx
  const startDate = stx.nextDate
  const count = stx.count
  const period = stx.period
  const endDate = stx.endDate

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
  let templateTx = tx.value
  templateTx.date = newDate
  //stx.transaction = JSON.stringify(templateTx)
  tx.value = templateTx

  stx.nextDate = newDate

  const result = await saveData()
  if (!result) {
    $q.notify({
      message: 'transaction not saved!',
      color: 'negative',
    })
  }
}
</script>
<script>
import Toolbar from '../components/CashierToolbar.vue'
import JournalTransaction from '../components/JournalTransaction.vue'
import appService from '../appService'
import { Iterator } from '../lib/scheduledTransactions'

export default {
  components: {
    Toolbar,
    JournalTransaction,
  },
  data() {
    return {
      // scheduledTx: {},
      confirmDeleteVisible: false,
      skipConfirmationVisible: false,
    }
  },

  methods: {
    async confirmDelete() {
      const id = this.scheduledTx.id
      if (!id) {
        console.error('the current scheduled transaction does not have an id')
        return
      }

      const result = await appService.db.scheduled
        .where('id')
        .equals(id)
        .delete()
      console.log('deletion result:', result)

      //this.resetTransaction()

      this.$router.back()
    },
    getNumericId() {
      // when navigating back, the id becomes string instead of original numeric
      if (typeof this.id === 'string') {
        return Number(this.id)
      }
      if (typeof this.id === 'number') {
        return this.id
      }

      throw new Error('Invalid Id value', this.id)
    },
    onEditClicked() {
      // open the editor
      const id = this.getNumericId()
      this.$router.push({ name: 'scheduledtxeditor', params: { id: id } })
    },
    async onSkipConfirmed() {
      try {
        await this.skip()

        this.$router.back()
      } catch (err) {
        this.$q.notify({ color: 'negative', message: err.message })
      }
    },
  },
}
</script>
