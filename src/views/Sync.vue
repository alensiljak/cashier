<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>The synchronization is done with an instance of hledger-web.</p>

    <div>
      <q-btn @click="btnClick" label="save" color="secondary" text-color="accent"/>
      <q-btn @click="onLoadClick" label="load" color="secondary" text-color="accent"/>
      <div>{{ test }}</div>
    </div>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";
import { Transaction } from "../model";
import db from "../dataStore";

export default {
  data() {
    return {
      test: "nothing yet"
    };
  },
  created() {
    this.$store.commit(SET_TITLE, "Synchronization");

    this.onLoadClick();
  },
  methods: {
    btnClick() {
      // save some data
      let x = new Transaction();
      x.payee = "yo!";
      db.transactions.put(x).catch(err => console.error(err));
    },
    onLoadClick() {
      // todo load settings
      //   let col = db.transactions.toCollection();
      //   .then(col => {
      //   console.log(col);
      // this.test = col;
      //   });
      let col = db.transactions.filter(tx => {
        return tx.id % 2 == 0;
      });
      col.each((item, cursor) => {
        console.log(item);
        console.log(cursor);
      });
    }
  }
};
</script>
