<template>
  <q-page padding class="text-colour2">
    <toolbar title="Register" />

    <div class="text-center q-mp-none bg-primary">
      <span>{{ account.name }}</span>
      <span class="q-ml-lg">Balance: {{ balance }} {{ account.balance?.currency }}</span>
    </div>

    <q-list>
      <q-item v-for="posting in postings" :key="posting.id" clickable class="q-px-none"
        @click="onItemClick(posting.transactionId)">
        <q-item-section side>{{ posting.date }}</q-item-section>
        <q-item-section>{{ posting.title }}</q-item-section>
        <q-item-section side>
          {{ formatNumber(posting.amount) }}
          {{ posting.currency }}
        </q-item-section>
      </q-item>
    </q-list>

    <!-- <footer>Footer</footer> -->

    <!-- fab -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClick">
        <icon-plus />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import Toolbar from '../components/CashierToolbar.vue'
import { onMounted, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import appService from '../appService'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { SET_SELECT_MODE } from '../mutations'
import { SelectionModeMetadata, SettingKeys, settings } from '../lib/settings'
import { Account, Posting } from 'src/model'
import { TransactionParser } from 'src/lib/transactionParser'
import { TransactionAugmenter } from 'src/lib/xactAugmenter'
import useNotifications from 'src/lib/Notifier'
import { Plus as IconPlus } from 'lucide-vue-next'
import { AccountService } from 'src/lib/accountsService'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useStore()
const Notification = useNotifications()

const ACCOUNT = 'account'

// data

const account: Ref<Account> = ref(new Account(''))
const postings: Ref<Posting[]> = ref([])
const balance = ref('')


// mounted

onMounted(async () => {
  //
  await loadData()
})

// methods

/**
 * Calculate the current balance by adding all the values.
 */
function calculateBalance() {
  let runningBalance = 0
  postings.value.forEach((posting) => {
    if (account.value.currency && posting.currency !== account.value.currency) {
      const msg = 'The postings contain multiple currencies'
      console.warn(msg)
      Notification.negative(msg)
    }

    runningBalance += posting.amount
  })

  // round to 2 decimals
  balance.value = runningBalance.toFixed(2)
}

function createStartingBalancePosting(
  amount: number,
  currency: string
) {
  let record = new Posting()
  record.date = 'n/a'
  record.title = 'Opening Balance'

  if (typeof amount === 'undefined') {
    amount = 0
  }

  record.amount = amount
  record.currency = currency

  return record
}

function formatNumber(value: number) {
  return appService.formatNumber(value)
}

async function loadData() {

  const accountName = route.params.name as string
  const accountRecord = await appService.db.accounts.get(accountName)
  account.value = accountRecord

  let txs = await appService.loadAccountTransactionsFor(accountName)

  // append transaction details to postings.
  txs.forEach((tx) => {
    tx.postings.forEach((posting) => {
      posting.date = tx.date
      posting.title = tx.payee
    })
  })
  let localPostings = TransactionParser.extractPostingsFor(txs, accountName)

  // create the record for the opening balance?
  const defaultCurrency = await settings.get(SettingKeys.currency)
  const acctSvc = new AccountService()
  const acctBalance = acctSvc.getAccountBalance(account.value, defaultCurrency)
  const startingBalanceRecord = createStartingBalancePosting(
    acctBalance.amount as number,
    acctBalance.currency as string
  )
  localPostings.splice(0, 0, startingBalanceRecord)

  postings.value = localPostings

  // calculate the current balance
  calculateBalance()
}

function onFabClick() {
  // add posting with this account
  sendAccountToTransaction(account.value)
}

function onItemClick(txId: number) {
  router.push({ name: 'tx', params: { id: txId } })
}

/**
 * Sets the account as a result of selection process.
 * @param accountToSend the name of the account
 */
function sendAccountToTransaction(accountToSend: Account) {
  const selectMode = new SelectionModeMetadata()

  // set the type
  selectMode.selectionType = ACCOUNT
  // simulate account selection
  selectMode.selectedId = accountToSend.name
  // set the selection mode
  store.commit(SET_SELECT_MODE, selectMode)
  // show account picker
  router.push({ name: 'tx' })
}

/**
 * Add the transaction date and the payee to the posting record.
 * @param {Array} postings
 */
async function loadTransactionsFor(postingRecords: Posting[]) {
  const txIds = postingRecords.map((posting) => posting.transactionId)
  const txs = await appService.db.transactions.bulkGet(txIds)

  // Append display fields to the postings directly.
  txs.forEach((tx, index) => {
    postingRecords[index].date = txs[index].date
    postingRecords[index].title = txs[index].payee
  })

  // sort by date desc
  postingRecords.sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  return postingRecords
}
</script>
