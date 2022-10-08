<template>
  <div>
    <!-- date -->
    <div id="dateSelector">
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date
          ref="datePicker"
          v-model="tx.date"
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

      <q-input v-model="tx.date" label="Date" @click="datePickerVisible = true">
        <template #prepend>
          <font-awesome-icon icon="calendar-day" />
        </template>
      </q-input>
    </div>

    <!-- payee -->
    <q-input v-model="tx.payee" label="Payee" @click.once="onPayeeClick">
      <template #prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>

    <!--note -->
    <q-input v-model="tx.note" label="Note">
      <template #prepend>
        <font-awesome-icon icon="file-alt" />
      </template>
    </q-input>

    <!-- Postings -->
    <div class="row q-mt-sm bg-primary">
      <div class="col q-px-xs">Postings</div>
      <div class="col-auto q-px-xs">Sum: {{ formatNumber(postingSum) }}</div>
    </div>

    <!-- <div> -->
    <q-slide-item
      v-for="(posting, index) in tx.postings"
      :key="index"
      left-color="secondary"
      class="q-px-none"
      @left="onSlide"
    >
      <template #left>
        <div class="row items-center text-accent" @click="deletePosting(index)">
          Click to confirm or wait 2s to cancel
          <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
        </div>
      </template>
      <q-item class="q-px-none">
        <q-item-section>
          <QPosting
            :index="index"
            @delete-row="deletePosting"
            @account-clicked="onAccountClicked(index)"
            @amount-changed="onAmountChanged"
            @currency-changed="onCurrencyChanged"
          />
        </q-item-section>
      </q-item>
    </q-slide-item>
    <!-- </div> -->

    <!-- warnings -->
    <div v-if="hasMultipleCurrencies" class="q-my-sm text-right">
      Multiple currencies found
      <q-icon name="warning" color="accent" size="sm" />
    </div>

    <!-- posting actions -->
    <div class="row justify-center text-center q-my-lg">
      <q-btn
        color="primary"
        text-color="accent"
        size="medium"
        class="col-auto q-mr-md"
        @click="addPosting"
      >
        <q-icon name="add_circle" class="q-icon-small on-left" />
        <div>Add</div>
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="medium"
        class="col-auto"
        @click="reorderPostings"
      >
        <!-- <font-awesome-icon
          icon="sort"
          transform="grow-9"
          class="q-icon-small on-left"
        /> -->
        <q-icon name="swap_vertical_circle" class="q-icon-small on-left" />
        <div>Reorder</div>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
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
import QPosting from '../components/Posting.vue'

const router = useRouter()
const mainStore = useMainStore()
const store = useStore()
const { tx } = storeToRefs(mainStore)

// data
const datePickerVisible = ref(false)
let resetSlide: any = null
const postingSum = ref(0)
const hasMultipleCurrencies = ref(false)

if (!tx.value) {
  tx.value = new Transaction()
}

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
  tx.value?.postings.push(new Posting())

  validateCurrencies()
}

function deletePosting(index: number) {
  if (resetSlide) {
    // remove the slide section.
    resetSlide()
    resetSlide = null
  }

  tx.value?.postings.splice(index, 1)

  recalculateSum()
  validateCurrencies()
}

function finalizeSlide(reset: any) {
  let timer = setTimeout(() => {
    // has it been already deleted?
    if (!reset) return

    reset()
  }, 2000)
}

function formatNumber(value: number) {
  return appService.formatNumber(value)
}

/**
 * Find an empty posting, or create one.
 */
function getEmptyPostingIndex() {
  if (!tx.value) {
    throw new Error('No transaction loaded!')
  }

  for (let i = 0; i < tx.value.postings.length; i++) {
    const posting = tx.value.postings[i]
    if (!posting.account && !posting.amount && !posting.currency) {
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
async function loadLastTransaction(payee: string) {
  if (!tx.value) {
    throw new Error('No transaction loaded!')
  }

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

function onCurrencyChanged() {
  validateCurrencies()
}

function onSlide({ reset }: { reset: any }) {
  resetSlide = reset
  finalizeSlide(reset)
}

function recalculateSum() {
  if (!tx.value) {
    throw new Error('No transaction loaded!')
  }

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

/**
 * Check if there are multiple non-matching currencies and show a warning.
 * Non-matching means there are no even number of same-currency accounts,
 * assuming Trading accounts are used.
 */
function validateCurrencies() {
  if (!tx.value) {
    throw new Error('No transaction loaded!')
  }

  // get the currencies from all postings
  let currencies = tx.value.postings.map((posting) => posting.currency)

  // separate by name
  let uniqueNames = [...new Set(currencies)]
  let totalCurrencies = uniqueNames.length

  // check the number for each name
  const counts: any = {}
  for (const currency of currencies) {
    counts[currency] = counts[currency] ? counts[currency] + 1 : 1
  }
  // uniqueNames.forEach(currencyName => {
  //   //counts[currencyName]
  // })

  hasMultipleCurrencies.value = totalCurrencies > 1
}
</script>
<script lang="ts">
import { SET_SELECT_MODE } from '../mutations'
import { Posting, Transaction } from '../model'

export default {
  methods: {
    onAccountClicked(index: number) {
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
