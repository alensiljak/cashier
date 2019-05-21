<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>The synchronization is done with an instance of hledger-web.</p>

    <div class="q-my-md">
      <p>Demo fetching accounts from the server</p>
      <q-input v-model="serverUrl" label="Server URL" dark />

      <q-btn label="Connect" @click="onConnectClicked" color="secondary" text-color="accent" />
    </div>

    <div>
      <q-btn @click="onSaveClicked" label="save" color="secondary" text-color="accent"/>
      <q-btn @click="onLoadClick" label="load" color="secondary" text-color="accent"/>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import db from '../dataStore'
import { SyncService } from '../sync'

export default {
  data() {
    return {
      serverUrl: ''
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "Synchronization");
    this.$store.commit(MAIN_TOOLBAR, true)

    this.onLoadClick();
  },

  methods: {
    onConnectClicked() {
      console.log('connect')
      let sync = new SyncService(this.serverUrl)
      sync.readAccounts().then(response => {
        console.log(response)
      })
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
    },
    onSaveClicked() {
      // 
    },
  }
};
</script>
