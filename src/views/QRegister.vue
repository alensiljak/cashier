<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <div class="container">Transactions go here. Show all if not filtered by a specific account.</div>

    <q-list></q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" text-color="accent"
        v-on:click="openNewTransaction"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "Register");
  },
  methods: {
    openNewTransaction() {
      this.$router.push({ name: "newTransaction" });
    }
  },
  components: {}
};
</script>
