<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Asset Allocation Setup</p>

    <ul>
      <li>definition</li>
      <li>read quantities</li>
      <li>import prices or balance in currency</li>
      <li>Calculate</li>
    </ul>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "AA Setup");

    // this.dlPrice()
  },

  methods: {
  }
};
</script>
