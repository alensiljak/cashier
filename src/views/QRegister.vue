<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <div class="container">Transactions go here. Show all if not filtered by a specific account.</div>

    <q-list>
      <q-item v-for="tx in transactions" :key="tx.id">
        <q-item-section>{{ tx.date }} {{ tx.payee }}</q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" text-color="accent"
        v-on:click="openNewTransaction"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";
import db from '../dataStore'

export default {
  data() {
    return {
      transactions: []
    }
  },
  created() {
    this.$store.commit(SET_TITLE, "Register");
    
    this.loadData()
  },
  methods: {
    loadData() {
      // load all transactions and related postings
      db.transactions.toArray()
        .then(value => {
          console.log('data loaded:', value)
          this.transactions = value
        })
    },
    openNewTransaction() {
      this.$router.push({ name: "newTransaction" });
    }
  },
  components: {}
};
</script>
