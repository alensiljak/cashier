<template>
  <div>
    <!-- date -->
    <div id="dateSelector">
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date
          ref="datePicker"
          v-model="tx.date"
          dark
          first-day-of-week="1"
          today-btn
          mask="YYYY-MM-DD"
          @input="onDateSelected"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <!-- <q-btn v-close-popup label="Cancel" color="primary" flat /> -->
            <q-btn v-close-popup label="OK" color="accent" flat />
          </div>
        </q-date>
      </q-dialog>

      <q-input
        v-model="tx.date"
        label="Date"
        dark
        @click="datePickerVisible = true"
      >
        <template #prepend>
          <font-awesome-icon icon="calendar-day" />
        </template>
      </q-input>
    </div>

    <!-- payee -->
    <q-input v-model="tx.payee" label="Payee" dark @click.once="onPayeeClick">
      <template #prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>

    <!--note -->
    <q-input v-model="tx.note" label="Note" dark>
      <template #prepend>
        <font-awesome-icon icon="file-alt" />
      </template>
    </q-input>

    <!-- Postings -->
    <div class="row q-mt-sm bg-primary">
      <div class="col-auto q-px-xs">Postings</div>
    </div>

    <div>
      <q-slide-item
        v-for="(posting, index) in tx.postings"
        :key="index"
        dark
        left-color="secondary"
        class="q-px-none"
        @left="onSlide"
      >
        <template #left>
          <div
            class="row items-center text-accent"
            @click="deletePosting(index)"
          >
            Click to confirm or wait 2s to cancel
            <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
          </div>
        </template>
        <q-item dark class="bg-colour1 q-px-none">
          <q-item-section>
            <QPosting
              :index="index"
              @delete-row="deletePosting"
              @account-clicked="onAccountClicked(index)"
              @amount-changed="onAmountChanged"
            />
          </q-item-section>
        </q-item>
      </q-slide-item>

      <!-- Sum -->
      <q-item dark>
        <q-item-section>
          <q-item-label>Sum</q-item-label>
        </q-item-section>
        <q-item-section avatar>{{ formatNumber(postingSum) }}</q-item-section>
      </q-item>
    </div>

    <!-- posting actions -->
    <div class="row justify-center text-center q-mb-md">
      <q-btn
        color="primary"
        text-color="accent"
        size="medium"
        class="col-auto q-mr-md"
        @click="addPosting"
      >
        <font-awesome-icon
          icon="plus-circle"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        <div>Add</div>
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="medium"
        class="col-auto"
        @click="reorderPostings"
      >
        <font-awesome-icon
          icon="sort"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        <div>Reorder</div>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  SelectionModeMetadata,
  SettingKeys,
  settings,
} from '../lib/Configuration'
import appService from '../appService'

const router = useRouter()
const mainStore = useMainStore()
const store = useStore()
const { tx } = storeToRefs(mainStore)

// data
const datePickerVisible = ref(false)
let resetSlide = null
const postingSum = ref(0)

// are we back from the select mode?
if (store.state.selectModeMeta) {
  handleSelection()
}

// mounted
onMounted(() => {
  recalculateSum()
})

// methods

function addPosting() {
  tx.value.postings.push(new Posting())
}

function deletePosting(index) {
  if (resetSlide) {
    // remove the slide section.
    resetSlide()
    resetSlide = null
  }

  tx.value.postings.splice(index, 1)

  recalculateSum()
}

function finalizeSlide(reset) {
  let timer = setTimeout(() => {
    // has it been already deleted?
    if (!reset) return

    reset()
  }, 2000)
}

function formatNumber(value) {
  return appService.formatNumber(value)
}

/**
 * Find an empty posting, or create one.
 */
function getEmptyPostingIndex() {
  for (let i = 0; i < tx.value.postings.length; i++) {
    const posting = tx.value.postings[i]
    if (!posting.account && !posting.amount && !posting.commodity) {
      return i
    }
  }

  // not found. Create a new one.
  const posting = new Posting()
  tx.value.postings.push(posting)
  return tx.value.postings.length - 1
}

/**
 * Handle selection after a picker returned.
 */
async function handleSelection() {
  // todo handle blank id if the user presses 'back'.
  const select = store.state.selectModeMeta
  const id = select.selectedId

  switch (select.selectionType) {
    case 'payee':
      tx.value.payee = id
      await loadLastTransaction(id)
      break

    case 'account':
      // get the posting
      var index = null
      if (typeof select.postingIndex === 'number') {
        index = select.postingIndex
      } else {
        // redirected from account register, find an appropriate posting
        index = getEmptyPostingIndex()
      }
      let posting = tx.value.postings[index]

      const account = await appService.db.accounts.get(id)
      posting.account = account.name
      posting.currency = account.currency

      break
  }

  // clean-up, reset the selection values
  store.commit(SET_SELECT_MODE, null)
}

/**
 * Load the last transaction for the payee
 */
async function loadLastTransaction(payee) {
  // do this only if enabled
  const enabled = await settings.get(SettingKeys.rememberLastTransaction)
  if (!enabled) return
  // and we are not on an existing transaction
  if (tx.value.id) return

  const lastTx = await appService.db.lastTransaction.get(payee)
  if (!lastTx) return
  // use the current date
  lastTx.transaction.date = tx.value.date
  // Replace the current transaction.
  mainStore.setTransaction(lastTx.transaction)
}

function onAmountChanged() {
  // recalculate the sum
  recalculateSum()
}

function onSlide({ reset }) {
  resetSlide = reset
  finalizeSlide(reset)
}

function recalculateSum() {
  postingSum.value = 0

  if (!tx.value.postings) return

  for (let i = 0; i < tx.value.postings.length; i++) {
    const posting = tx.value.postings[i]
    if (!isNaN(posting.amount)) {
      postingSum.value += posting.amount
    } else {
      console.warn('The amount is not a number:', posting.amount)
    }
  }
}

function reorderPostings() {
  router.push({ name: 'reorder postings' })
}
</script>
<script>
import { SET_SELECT_MODE } from '../mutations'
import QPosting from '../components/Posting.vue'
import { Posting } from '../model'

export default {
  components: {
    QPosting,
  },

  methods: {
    onAccountClicked(index) {
      const selectMode = new SelectionModeMetadata()

      // save the index of the posting being edited
      selectMode.postingIndex = index
      // set the type
      selectMode.selectionType = 'account'

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode)
      // show account picker
      this.$router.push({ name: 'accounts' })
    },
    /**
     * (value, reason, details)
     */
    onDateSelected(value, reason) {
      if (reason !== 'day' && reason !== 'today') return

      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
    onPayeeClick() {
      const selectMode = new SelectionModeMetadata()

      // set the type
      selectMode.selectionType = 'payee'

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode)
      // show account picker
      this.$router.push({ name: 'payees' })
    },
  },
}
</script>
