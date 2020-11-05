<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />

    <tx-editor />

    <schedule-editor />

    <div>
      <q-btn class="q-mr-md">Skip</q-btn>
      <q-btn>Post</q-btn>
    </div>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import TxEditor from '../components/TransactionEditor'
import ScheduleEditor from '../components/ScheduleEditor'
import appService from '../appService'

export default {
  components: {
    Toolbar,
    ScheduleEditor,
    TxEditor,
  },
  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      //this.tx = await appService.loadTransaction(id)
    },
  },
}
</script>
