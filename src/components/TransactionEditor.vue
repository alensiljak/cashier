<template>
  <div>
    <!-- date -->
    <div id="dateSelector">
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date ref="datePicker" v-model="tx.date" first-day-of-week="1" today-btn mask="YYYY-MM-DD"
          @input="onDateSelected">
          <div class="row items-center justify-end q-gutter-sm">
            <!-- <q-btn v-close-popup label="Cancel" color="primary" flat /> -->
            <q-btn v-close-popup label="OK" color="accent" flat />
          </div>
        </q-date>
      </q-dialog>

      <q-input v-model="tx.date" label="Date" @click="datePickerVisible = true">
        <template #prepend>
          <IconCalendar :size="iconSize" />
        </template>
      </q-input>
    </div>

    <!-- payee -->
    <q-input v-model="tx.payee" label="Payee" @click.once="onPayeeClick">
      <template #prepend>
        <icon-user :size="iconSize" />
      </template>
    </q-input>

    <!--note -->
    <q-input v-model="tx.note" label="Note">
      <template #prepend>
        <file-text :size="iconSize" />
      </template>
    </q-input>

    <!-- Postings section -->
    <div class="row q-mt-sm bg-primary">
      <div class="col q-px-xs">Postings</div>
      <div class="col-auto q-px-xs">Sum: {{ formatNumber(postingSum) }}</div>
    </div>

    <!-- posting actions -->
    <div class="row justify-center text-center q-mb-sm q-mt-sm">
      <q-btn color="primary" text-color="accent" size="medium" class="col-auto q-mr-lg" @click="addPosting">
        <PlusCircle />
        <!-- <div>Add</div> -->
      </q-btn>
      <q-btn color="primary" text-color="accent" size="medium" class="col-auto q-mr-lg" @click="reorderPostings">
        <ArrowUpDown />
        <!-- <div>Reorder</div> -->
      </q-btn>
      <q-btn color="primary" text-color="accent" size="medium" class="col-auto" @click="onDeletePostingsClicked">
        <Trash />
        <!-- <div>Delete</div> -->
      </q-btn>
    </div>

    <!-- Postings -->
    <q-item v-for="(posting, index) in tx?.postings" :key="index" class="q-px-none">
      <q-item-section>
        <QPosting :index="index" @account-clicked="onAccountClicked(index)" @amount-changed="onAmountChanged"
          @currency-changed="onCurrencyChanged" />
      </q-item-section>
    </q-item>

    <!-- warnings -->
    <div v-if="hasInvalidCurrencies" class="q-my-sm text-right">
      <span>Invalid currencies</span>
      <AlertOctagon class="icon on-right" size="22" />
    </div>
    <div v-if="hasMultipleCurrencies" class="q-my-sm text-right">
      Multiple currencies found
      <AlertTriangle class="icon on-right" />
    </div>
    <div v-if="hasMultipleNans" class="q-my-sm text-right">
      Multiple empty amounts found
      <AlertTriangle class="icon on-right" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  SelectionModeMetadata,
  SettingKeys,
  settings,
} from '../lib/settings'
import appService from '../appService'
import QPosting from '../components/Posting.vue'
import { SET_SELECT_MODE } from '../mutations'
import { Posting, Transaction } from '../model'
import {
  AlertOctagon, AlertTriangle, ArrowUpDown, Calendar as IconCalendar, FileText,
  PlusCircle, User as IconUser, Trash
} from 'lucide-vue-next'
import { AccountService } from '../lib/accountsService'

const router = useRouter()
const mainStore = useMainStore()
const store = useStore()
const { tx } = storeToRefs(mainStore)

// data
const datePickerVisible = ref(false)
const postingSum = ref(0)
const hasInvalidCurrencies = ref(false)
const hasMultipleCurrencies = ref(false)
const hasMultipleNans = ref(false)
const iconSize = ref(28)

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
  if (!tx.value) {
    throw new Error('No transaction loaded!')
  }

  // todo handle blank id if the user presses 'back'.
  const select = store.state.selectModeMeta
  const id = select.selectedId

  const defaultCurrency = await settings.get(SettingKeys.currency)

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

      // load the account
      const account = await appService.db.accounts.get(id)
      const acctSvc = new AccountService()
      const acctBalance = await acctSvc.getAccountBalance(account, defaultCurrency)
      posting.account = account.name
      posting.currency = acctBalance.currency

      recalculateSum()
      validateCurrencies()

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

function onAccountClicked(index: number) {
  const selectMode = new SelectionModeMetadata();
  // save the index of the posting being edited
  selectMode.postingIndex = index;
  // set the type
  selectMode.selectionType = 'account';
  // set the selection mode
  store.commit(SET_SELECT_MODE, selectMode);
  // show account picker
  router.push({ name: 'accounts' });
}

function onAmountChanged() {
  // recalculate the sum
  recalculateSum()
}

function onCurrencyChanged() {
  validateCurrencies()
}

function onDeletePostingsClicked() {
  router.push('/postings-delete')
}

/**
 * Recalculate the sum and validate amounts.
 * Only one posting should be allowed to have an empty amount.
 */
function recalculateSum() {
  if (!tx.value) {
    throw new Error('No transaction loaded!')
  }

  postingSum.value = 0

  if (!tx.value.postings) return

  let invalidCount = 0

  tx.value.postings.forEach((posting) => {
    if (isNaN(posting.amount)) {
      console.warn('The amount is not a number:', posting.amount)
      invalidCount++
    } else {
      postingSum.value += posting.amount
    }
  })

  hasMultipleNans.value = invalidCount > 1
}

function reorderPostings() {
  router.push('/postings-reorder')
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

  // check the number for each name
  const counts: any = {}
  for (const currency of currencies) {
    counts[currency] = counts[currency] ? counts[currency] + 1 : 1
  }

  // only one currency is allowed blank
  hasInvalidCurrencies.value = counts[''] > 1

  // remove the empty currency now.
  currencies = currencies.filter((currency) => currency)

  // separate by name
  let uniqueNames = [...new Set(currencies)]
  let totalCurrencies = uniqueNames.length

  // delete counts['']
  // multiple currencies
  hasMultipleCurrencies.value = totalCurrencies > 1
}
</script>
<script lang="ts">

export default {
  methods: {
    /**
     * (value, reason, details)
     */
    onDateSelected(value: any, reason: any) {
      if (reason !== 'day' && reason !== 'today')
        return;
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide();
      // the date is saved on close.
    },
    onPayeeClick() {
      const selectMode = new SelectionModeMetadata();
      // set the type
      selectMode.selectionType = 'payee';
      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode);
      // show account picker
      this.$router.push({ name: 'payees' });
    },
  },
}
</script>
