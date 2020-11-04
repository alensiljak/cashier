<template>
  <q-card dark bordered class="my-card" @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Device Journal</q-card-section> -->
    <q-card-section><strong>Device Journal</strong></q-card-section>

    <q-list dense>
      <q-item v-for="tx in transactions" :key="tx.id">
        <span class="q-mr-lg">{{ tx.date }}</span>
        {{ tx.payee }}
      </q-item>
    </q-list>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        flat
        dark
        color="primary"
        text-color="accent"
        @click.stop="onNewTxClick"
      >
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
    onNewTxClick() {
      this.$router.push({ name: 'newtx' })
    },
  },
}
</script>