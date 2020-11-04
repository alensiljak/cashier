<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Schedule Editor'" />

    <p>Transaction Details</p>
    <journal-transaction :tx="tx" />

    <p>Schedule</p>
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