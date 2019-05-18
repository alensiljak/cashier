<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <div>Transactions go here. Show all if not filtered by a specific account.</div>

    <q-list>
      <q-item v-for="tx in transactions" :key="tx.id" >
        <!-- clickable @click="onItemClicked" -->
        <q-item-section>{{ tx.date }} {{ tx.payee }}</q-item-section>
        <q-item-section avatar>
          <q-btn color="secondary" text-color="accent" icon="delete" round size="sm"
            @click='onDeleteClicked' :data-id='tx.id' />
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" text-color="secondary" @click="openNewTransaction"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";
import db from "../dataStore";
import appService from '../appService'

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
      db.transactions.toArray().then(value => {
        // console.log("data loaded:", value);
        this.transactions = value;
      });
    },
    onDeleteClicked: function(event) {
      var errorMessage = {
        color: 'secondary',
        message: ''
      }

      let ctl = event.currentTarget
      let id = ctl.getAttribute('data-id')
      // this.$q.notify(errorMessage)

      var that = this
      // delete transaction
      appService.deleteTransaction(id)
        .then(() => {
          this.$q.notify('Transaction deleted')
          this.loadData()
        })
        .catch(reason => {
          // console.error(reason)
          errorMessage.message = reason.message
          that.$q.notify(errorMessage)
        })
    },
    onItemClicked(event) {
      console.log('clicked', event);
    },
    openNewTransaction() {
      this.$router.push({ name: "newTransaction" });
    }
  },
  components: {}
};
</script>
