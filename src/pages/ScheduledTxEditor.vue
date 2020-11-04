<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />
    
    <tx-editor />
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import TxEditor from '../components/TransactionEditor'

export default {
  components: {
    Toolbar,
    TxEditor
  },
  created() {
  }
};
</script>
