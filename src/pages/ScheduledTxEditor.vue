<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />
    
    <tx-editor />

    <schedule-editor />
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import TxEditor from '../components/TransactionEditor'
import ScheduleEditor from '../components/ScheduleEditor'

export default {
  components: {
    Toolbar,
    ScheduleEditor,
    TxEditor
  },
  created() {
  }
};
</script>
