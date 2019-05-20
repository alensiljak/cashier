<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>List of payees</p>
  </q-page>
</template>

<script>
import { SET_TITLE, MAIN_TOOLBAR } from '../mutations'

export default {
  data: function() {
    return {
      //date: null
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "Payees");
    this.$store.commit(MAIN_TOOLBAR, true);
  },

  mounted() {
    // read the current payee?
    // just list existing payees?
  },

  components: {}
};
</script>
