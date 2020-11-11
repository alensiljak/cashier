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
          <span class="q-mr-lg">{{ tx.date }}</span>
          {{ tx.payee }}
        </q-item>
      </q-list>
    </q-card-section>

    <!-- <q-separator dark /> -->

    <q-card-actions align="between">
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
      <q-btn
        outline
        dark
        color="primary"
        text-color="accent"
        @click.stop="onNewTxClick"
      >
        <font-awesome-icon icon="plus" class="q-icon-small on-left" />
        New
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import appService from '../appService'

export default {
  data() {
    return {
      transactions: [],
    }
  },
  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      // load all transactions and related postings
      try {
        this.transactions = await appService.db.transactions
          .orderBy('date')
          .reverse()
          .limit(5)
          .toArray()
      } catch (error) {
        this.$q.notify({ color: 'secondary', message: error.message })
      }
    },
    onCardClick() {
      // for some reason, need to explicitly forward the event
      this.$emit('click')
    },
    onExportTxClick() {
      this.$router.push({ name: 'export', params: { type: 'journal' } })
    },
    onNewTxClick() {
      this.$router.push({ name: 'tx' })
    },
  },
}
</script>
