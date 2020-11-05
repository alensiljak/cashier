<template>
  <div>
    <p>Transaction</p>
    <journal-transaction :tx="tx" />

    <q-separator dark class="q-my-lg" />

    <p>Schedule</p>
    <div>
      <ul>
        <li>Once (null)</li>
        <li>Every 'count' 'periods'</li>
      </ul>
    </div>

    <div>End on 'endDate'; never (null)</div>

    <div>Delete Schedule; Save Schedule</div>
  </div>
</template>

<script>
import JournalTransaction from '../components/JournalTransaction'

export default {
  components: {
    JournalTransaction,
  },

  data() {
    return {
      tx: null,
      scheduledTx: null
    }
  },

  created() {
    this.loadTransaction()
  },

  methods: {
    loadTransaction() {
      this.tx = this.$store.getters.transaction
    },
  },
}
</script>