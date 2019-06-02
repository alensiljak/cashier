<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>The synchronization is done with an instance of hledger-web.</p>

    <div class="q-my-md">
      <q-input v-model="serverUrl" label="Server URL" dark/>

      <q-btn label="Connect" @click="onConnectClicked" color="secondary" text-color="accent"/>
    </div>

    <div class="text-center">
      <q-list>
        <q-item>
          <!-- <q-item-label></q-item-label> -->
          <q-item-section>
            <q-checkbox dark v-model="syncBalances" label="Sync balances" />
          </q-item-section>
        </q-item>
      </q-list>
        <q-item>
          <q-item-section>
            <q-checkbox dark v-model="syncAaValues" label="Sync asset allocation current values" />
          </q-item-section>
        </q-item>
      <q-btn label="Sync" color="secondary" text-color="accent" @click="synchronize"/>
    </div>

    <!-- <div>
      <q-input dark type="textarea" v-model="content"/>
    </div>
    <div>
      <q-btn @click="onSaveClicked" label="save" color="secondary" text-color="accent"/>
      <q-btn @click="onLoadClick" label="load" color="secondary" text-color="accent"/>
    </div> -->
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
// import db from '../dataStore'
import { SettingKeys, settings } from "../lib/Configuration";
import { CashierSync } from "../lib/syncCashier";

export default {
  data() {
    return {
      serverUrl: "",
      syncBalances: true,
      syncAaValues: true,
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
      let sync = new CashierSync(this.serverUrl);
      sync
        .healthCheck()
        .then(response => this.$q.notify({ message: response }));
    },
    onLoadClick() {
      this.loadSettings();
    },
    onSaveClicked() {
      // save settings
      settings.set(SettingKeys.syncServerUrl, this.serverUrl).then(() => {
        this.$q.notify("settings saved");
      });
    },
    synchronizeAaValues() {

    },
    synchronizeBalances() {
      let sync = new CashierSync(this.serverUrl);

      sync.readAccounts().then(response => {
        this.$q.notify({message: 'balances loaded', color:'primary'})
      });
    },
    synchronize() {
      if(this.syncBalances) {
        this.synchronizeBalances()
      }
      if(this.syncAaValues) {
        this.synchronizeAaValues()
      }
    }
  }
};
</script>
