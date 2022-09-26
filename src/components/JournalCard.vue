<template>
  <q-card bordered class="my-card" @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Device Journal</q-card-section> -->
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="scroll" class="q-mr-sm" />
      <strong>Device Journal</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="transactions.length === 0">
        There are no local transactions
      </div>

      <q-list>
        <q-item v-for="tx in transactions" :key="tx.id" dense class="q-px-none">
          <q-item-section>{{ tx.date }} &nbsp; {{ tx.payee }}</q-item-section>
          <q-item-section side>
            <span
              :class="{
                red: tx.amount < 0,
                yellow: tx.amount === 0 || tx.amount === '<=>',
                green: tx.amount > 0,
              }"
            >
              {{ tx.amount }} {{ tx.currency }}
            </span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- <q-separator  /> -->

    <q-card-actions align="center">
      <q-btn
        outline
        color="primary"
        text-color="accent"
        @click.stop="onExportTxClick"
      >
        <font-awesome-icon icon="sign-out-alt" class="q-icon-small on-left" />
        Export
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import appService from '../appService'
import useNotifications from 'src/lib/CashierNotification'
import { TransactionParser } from 'src/lib/transactionParser'
import { Transaction } from 'src/model'

const Notification = useNotifications()
const $router = useRouter()
const emit = defineEmits(['click'])

const transactions: Ref<Transaction[]> = ref([])

onMounted(async () => {
  await loadData()
})

function onCardClick() {
  // for some reason, need to explicitly forward the event
  emit('click')
}

function onExportTxClick() {
  $router.push({ name: 'export', params: { type: 'journal' } })
}

function onNewTxClick() {
  $router.push({ name: 'tx' })
}

/**
 * load all transactions and related postings
 */
async function loadData() {
  let txs: Transaction[] = []

  try {
    txs = await appService.db.transactions
      .orderBy('date')
      .reverse()
      .limit(5)
      .toArray()
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }

  try {
    calculateTxAmounts(txs)
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }

  transactions.value = txs
}

/**
 * Find the amount to display, from the user's perspective - a debit, credit, transfer.
 * @param {Array<Transaction>} txs
 */
function calculateTxAmounts(txs: Transaction[]) {
  // get Amounts
  TransactionParser.calculateEmptyPostingAmounts(txs)

  // Find the asset account and decide on the flow direction.
  txs.forEach((tx) => {
    let amount = 'n/a'
    let currency = ''

    // get the assets posting(s)
    const postings = tx.postings.filter(
      (posting) =>
        posting.account.startsWith('Assets:') ||
        posting.account.startsWith('Liabilities:')
    )
    if (postings.length === 0) {
      console.warn('No postings found in Assets or Liabilities!')
    } else if (postings.length === 1) {
      tx.amount = postings[0].amount?.toFixed(2)
      tx.currency = postings[0].currency
    } else if (postings.length === 2) {
      // transfer
      tx.amount = '<=>'
      // todo: ...
    } else {
      // todo: handle these cases (transfers, complex tx)
      console.warn('more than one posting found with assets')
    }
  })
}
</script>

<style lang="sass" scoped>
@import "../css/palette.scss"

.red
  color: $negative

.yellow
  color: $warning

.green
  color: $positive

.remarks
  color: $colour2
</style>
  