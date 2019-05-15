<template>
  <div>
    <ActionBar title="Payees"/>

    <div class="container">
      <p>List of payees</p>
    </div>
  </div>
</template>
<script>
import ActionBar from "../components/ActionBar.vue";

export default {
  data: function() {
    return {
      //date: null
    };
  },
  mounted() {
    // read the current payee?
    // just list existing payees?
  },
  components: {
    ActionBar
  }
};
</script>
