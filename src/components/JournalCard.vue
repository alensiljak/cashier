<template>
  <q-card dark bordered class="my-card" @click="onCardClick">
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
          <q-item-section side>.</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- <q-separator dark /> -->

    <q-card-actions align="center">
      <q-btn
        outline
        dark
        color="primary"
        text-color="accent"
        @click.stop="onExportTxClick"
      >
        <font-awesome-icon icon="sign-out-alt" class="q-icon-small on-left" />
        Export
      </q-btn>
      <!-- <q-btn
        outline
        dark
        color="primary"
        text-color="accent"
        @click.stop="onNewTxClick"
      >
        <font-awesome-icon icon="plus" class="q-icon-small on-left" />
        New
      </q-btn> -->
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import appService from '../appService'
import useNotifications from 'src/lib/CashierNotification'

const Notification = useNotifications()
const $router = useRouter()
const emit = defineEmits(['click'])

const transactions = ref([])

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

async function loadData() {
  // load all transactions and related postings
  try {
    transactions.value = await appService.db.transactions
      .orderBy('date')
      .reverse()
      .limit(5)
      .toArray()
  } catch (error) {
    Notification.negative(error.message)
  }
}
</script>
