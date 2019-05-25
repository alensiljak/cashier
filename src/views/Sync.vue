<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>The synchronization is done with an instance of hledger-web.</p>

    <div class="q-my-md">
      <p>Demo fetching accounts from the server</p>
      <q-input v-model="serverUrl" label="Server URL" dark/>

      <q-btn label="Connect" @click="onConnectClicked" color="secondary" text-color="accent"/>

      <q-input dark type="textarea" v-model="content"/>
    </div>

    <div>
      <q-btn @click="onSaveClicked" label="save" color="secondary" text-color="accent"/>
      <q-btn @click="onLoadClick" label="load" color="secondary" text-color="accent"/>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
// import db from '../dataStore'
import { SettingKeys, settings } from "../Configuration";
import { SyncService } from "../sync";

export default {
  data() {
    return {
      serverUrl: "",
      content: null
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "Synchronization");
    this.$store.commit(MAIN_TOOLBAR, true);

    this.loadSettings();
  },

  methods: {
    loadSettings() {
      settings
        .get(SettingKeys.syncServerUrl)
        .then(value => (this.serverUrl = value));
    },
    onConnectClicked() {
      let sync = new SyncService(this.serverUrl);

      sync.readAccounts().then(accounts => {
        let message = "received " + accounts.length + " accounts";
        this.$q.notify(message);

        // console.log(response)
        let output = "";
        for (let i = 0; i < accounts.length; i++) {
          let account = accounts[i];
          output += account.name + "    " + account.balance + " " + account.commodity + '\n'
        }
        this.content = output;
      });
    },
    onLoadClick() {
      this.loadSettings();
    },
    onSaveClicked() {
      // save settings
      settings.set(SettingKeys.syncServerUrl, this.serverUrl).then(() => {
        this.$q.notify("settings saved");
      });
    }
  }
};
</script>
