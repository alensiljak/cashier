<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- Toolbar -->
        <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Register</q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <!-- <q-item clickable v-close-popup>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <q-icon name="sync"/>
                </q-item-section>
              </q-item> -->
              <q-item clickable v-close-popup>
                <q-item-section @click="exportRegister">Export</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

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
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
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
    this.$store.commit(MAIN_TOOLBAR, false);

    this.loadData();
  },
  mounted() {
    // this.$q.notify('yo')
  },

  methods: {
    exportRegister() {
      // todo export the register from here
      console.log('export register command')
    },
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
