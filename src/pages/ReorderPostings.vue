<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title>Reorder Postings</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <accounts-list v-model="postings" lock-axis="y">
      <posting-item
        v-for="(posting, index) in postings"
        :key="index"
        :index="index"
        :posting="posting"
      />
    </accounts-list>
  </q-page>
</template>
<script>
import AccountsList from "../components/SortableAccountsList.vue";
import PostingItem from "../components/SortablePostingItem.vue";
//import { CurrentTransactionService } from '../lib/currentTransactionService'
import eventBus from "../lib/eventBus";

export default {
  components: {
    AccountsList,
    PostingItem,
  },

  data() {
    return {
      postings: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      // load the postings
      //const svc = new CurrentTransactionService(this.$store)
      //let tx = svc.getTx()
      let tx = this.$store.getters.transaction;
      if (!tx) {
        tx = svc.createTransaction();
      }
      this.postings = tx.postings;
    },
    onSaveClicked() {
      this.save();
      this.$router.back();
    },
    save() {
      // save the postings into the local store
      //const svc = new CurrentTransactionService(this.$store)
      //let tx = svc.getTx()
      let tx = this.$store.getters.transaction;
      if (!tx) {
        tx = svc.createTransaction();
      }
      tx.postings = this.postings;

      this.$q.notify({ message: "data saved", color: "positive" });
    },
    toggleDrawer() {
      eventBus.$emit("toggle-drawer");
    },
  },
};
</script>