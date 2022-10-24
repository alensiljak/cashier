<template>
  <q-card bordered class="my-card" @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Device Journal</q-card-section> -->
    <q-card-section class="bg-primary q-pa-sm">
      <Scroll class="icon q-mr-sm" size="1.4em" />
      <strong>Device Journal</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="transactions.length === 0">
        There are no local transactions
      </div>

      <q-list>
        <q-item v-for="tx, index in transactions" :key="index" dense class="q-px-none">
          <q-item-section>{{ tx.date }} &nbsp; {{ tx.payee }}</q-item-section>
          <q-item-section side>
            <span :class="{
              red: txAmounts[index].amount < 0,
              yellow: txAmounts[index].amount === 0,
              green: txAmounts[index].amount > 0,
            }">
              {{ txAmounts[index].amount }} {{ txAmounts[index].currency }}
            </span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- <q-separator  /> -->

    <q-card-actions align="center">
      <q-btn outline color="primary" text-color="accent" @click.stop="onExportTxClick">
        <FileUp size="20" class="on-left" />
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
import { AccountBalance, Transaction } from 'src/model'
import { TransactionAugmenter } from 'src/lib/transactionAugmenter'
import { FileUp, Scroll } from 'lucide-vue-next'

const Notification = useNotifications()
const $router = useRouter()
const emit = defineEmits(['click'])

const transactions: Ref<Transaction[]> = ref([])
const txAmounts: Ref<AccountBalance[]> = ref([])

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
    const amounts = TransactionAugmenter.calculateTxAmounts(txs)
    txAmounts.value.push(...amounts)
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }

  transactions.value = txs
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
  