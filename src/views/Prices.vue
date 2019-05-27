<template>
  <q-page padding class="bg-colour1 text-amber-2">
      <p>Prices:</p>
      <ul>
          <li>Add the commodities</li>
          <li>select the commodities you want to track the prices for</li>
          <li>select the source</li>
          <li>update prices</li>
          <li>export in ledger format</li>
      </ul>
    </q-page>
</template>

<script>
import { SET_TITLE, MAIN_TOOLBAR } from '../mutations';

export default {
  created() {
    this.$store.commit(SET_TITLE, "Prices");
    this.$store.commit(MAIN_TOOLBAR, true);
  }
};
</script>
