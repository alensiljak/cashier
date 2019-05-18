<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <p>Display the chart of accounts with balances and currencies. Selecting one opens the register.</p>
    <p>The list should be customizable by selecting which accounts to show (favourite).</p>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" text-color="secondary" v-on:click="openNewTransaction"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "Balance Sheet");
  },
  methods: {
    openNewTransaction() {
      this.$router.push({ name: "newTransaction" });
    }
  }
};
</script>
