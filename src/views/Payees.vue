<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>List of payees</p>
  </q-page>
</template>

<script>
import { SET_TITLE } from '../mutations'

export default {
  data: function() {
    return {
      //date: null
    };
  },
  created() {
    this.$store.commit(SET_TITLE, "Payees");
  },
  mounted() {
    // read the current payee?
    // just list existing payees?
  },
  components: {}
};
</script>
