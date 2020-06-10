<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- <p>Register for {{account.name}}</p> -->

    <q-list>
      <q-item
        v-for="posting in postings"
        :key="posting.id"
        clickable
        @click="onItemClick(posting.transactionId)"
      >
        <q-item-section side>{{ posting.date }}</q-item-section>
        <q-item-section>{{ posting.title }}</q-item-section>
        <q-item-section side>{{ formatNumber(posting.amount) }} {{ posting.currency }}</q-item-section>
      </q-item>
    </q-list>

    <!-- fab -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClick">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import appService from "../appService";
import { MAIN_TOOLBAR, SET_TITLE, SET_SELECT_MODE } from "../mutations";
import { SelectionModeMetadata } from '../lib/Configuration';

const ACCOUNT = "account";

export default {
  data() {
    return {
      account: {},
      postings: []
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Register");

    this.loadData();
  },

  methods: {
    formatNumber(value) {
      return appService.formatNumber(value);
    },
    loadData() {
      let accountName = this.$route.params.name;
      appService.db.accounts.get(accountName).then(account => {
        this.account = account;
        this.loadPostings(accountName);
      });
    },
    async loadPostings(accountName) {
      let postings = await appService.db.postings.where({
        account: accountName
      });
      let postingArray = await postings.toArray();

      return this.loadTransactions(postingArray);
    },
    async loadTransactions(postings) {
      let txIds = [];
      postings.forEach(posting => {
        txIds.push(posting.transactionId);
      });
      let txs = await appService.db.transactions.bulkGet(txIds);

      // Append display fields to the postings directly.
      txs.forEach((tx, index) => {
        postings[index].date = txs[index].date;
        postings[index].title = txs[index].payee;
      });

      // sort by date desc
      postings.sort((a, b) => {
        return a.date > b.date ? -1 : 1;
      });

      this.postings = postings;
    },
    onFabClick() {
      // add posting with this account
      this.sendAccountToTransaction(this.account);
    },
    onItemClick(txId) {
      this.$router.push({ name: "tx", params: { id: txId } });
    },
    sendAccountToTransaction(account) {
      let selectMode = new SelectionModeMetadata();

      // set the type
      selectMode.selectionType = ACCOUNT;
      // simulate account selection
      selectMode.selectedId = account.name;
      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode);
      // show account picker
      this.$router.push({ name: "tx" });
    }
  }
};
</script>
