<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>Transactions go here. Show all if not filtered by a specific account.</div>

    <q-list dark>
      <register-transaction
        v-for="tx in transactions"
        :key="tx.id"
        :tx="tx"
        @txDeleted="onTransactionDeleted"
      />
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" text-color="secondary" @click="openNewTransaction"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";
import appService from "../appService";
import RegisterTransaction from "../components/RegisterTransaction";

const errorMessage = { color: "secondary", message: "" };

export default {
  data() {
    return {
      transactions: []
    };
  },
  created() {
    this.$store.commit(SET_TITLE, "Register");

    this.loadData();
  },
  mounted() {
    // this.$q.notify('yo')
  },
  methods: {
    loadData() {
      // load all transactions and related postings
      appService
        .loadTransactions()
        .then(value => {
          this.transactions = value;
        })
        .catch(reason => {
          errorMessage.message = reason;
          this.$q.notify(errorMessage);
        });
    },
    onItemClicked(event) {
      console.log("clicked", event);
    },
    onTransactionDeleted() {
      this.loadData();
    },
    openNewTransaction() {
      this.$router.push({ name: "tx" });
    }
  },
  components: {
    RegisterTransaction
  }
};
</script>
