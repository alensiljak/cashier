<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Schedule Editor'" />

    <p>Transaction</p>
    <journal-transaction :tx="tx" />

    <q-separator dark class="q-my-lg" />

    <p>Schedule</p>
    <div>
      <ul>
        <li>Once on ...</li>
        <li>Every ...</li>
      </ul>
    </div>

    <div>End on ...; never</div>

    <div>Delete Schedule; Save Schedule</div>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import JournalTransaction from '../components/JournalTransaction'

export default {
  components: {
    JournalTransaction,
    Toolbar,
  },

  data() {
    return {
      tx: null,
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