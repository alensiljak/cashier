<template>
  <q-page padding class="text-colour2">
    <toolbar title="Register" />

    <div class="text-center q-mp-none bg-primary">
      <span>{{ account.name }}</span>
      <span class="q-ml-lg">Balance: {{ balance }} {{ account.currency }}</span>
    </div>

    <q-list>
      <q-item
        v-for="posting in postings"
        :key="posting.id"
        clickable
        class="q-px-none"
        @click="onItemClick(posting.transactionId)"
      >
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
        <q-icon name="add" />
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
import { SelectionModeMetadata } from '../lib/Configuration'
import { Account, Posting } from 'src/model'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useStore()

const ACCOUNT = 'account'

// data

const account: Ref<Account> = ref({
  name: '',
})
const postings: Ref<Posting[]> = ref([])
const balance = ref(0)

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
    if (posting.currency !== account.value.currency) {
      $q.notify({
        color: 'secondary',
        message: 'The postings contain multiple currencies',
      })
    }

    runningBalance += posting.amount
  })

  balance.value = runningBalance
}

function createStartingBalancePosting(accountBalance, currency: string) {
  let record = new Posting()
  record.date = 'n/a'
  record.title = 'Opening Balance'

  record.amount = accountBalance
  record.currency = currency

  return record
}

function formatNumber(value) {
  return appService.formatNumber(value)
}

async function loadData() {
  const accountName = route.params.name
  const accountRecord = await appService.db.accounts.get(accountName)
  account.value = accountRecord

  //let txs = await appService.loadAccountTransactionsFor(accountName)

  let postingRecords = await loadPostingsFor(accountName)
  postings.value = postingRecords

  // create the record for the opening balance?
  const startingBalanceRecord = createStartingBalancePosting(
    account.value.balance,
    account.value.currency
  )
  postings.value.splice(0, 0, startingBalanceRecord)

  // calculate the current balance
  calculateBalance()
}

async function loadPostingsFor(accountName: string) {
  const postingRecords = await appService.db.postings.where({
    account: accountName,
  })
  const postingArray = await postingRecords.toArray()

  let result = await loadTransactionsFor(postingArray)
  return result
}

function onFabClick() {
  // add posting with this account
  sendAccountToTransaction(account)
}

function onItemClick(txId) {
  router.push({ name: 'tx', params: { id: txId } })
}

function sendAccountToTransaction(accountToSend) {
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
async function loadTransactionsFor(postingRecords) {
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
