<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div class="row">
      <div class="col">
        <!-- currency -->
        <q-input dark label="Main Currency" v-model="currency"/>
      </div>
    </div>
    <p class="q-my-md">Investments</p>
    <div class="row">
      <div class="col">
        <!-- root investment account -->
        <q-input dark label="Root investment account" v-model="rootInvestmentAccount"/>
      </div>
    </div>

    <p class="q-my-md">Asset Allocation settings</p>
    <div class="row">
      <div class="col text-center">
        <q-btn :to="{name: 'assetallocationsetup'}" label="Asset Allocation configuration"
          color="secondary" text-color="accent"/>
      </div>
    </div>
    
    <p class="q-my-md">Synchronization</p>
    <div class="q-my-md row">
      <div class="col">
        <!-- server URL -->
        <q-input v-model="serverUrl" label="Server URL" dark/>
      </div>

      <div class="col text-center">
        <q-btn label="Connect" @click="onConnectClicked" color="secondary" text-color="accent"/>
      </div>
    </div>

    <div class="text-right q-my-md">
      <q-btn @click="onSaveClick" label="save" color="secondary" text-color="accent"/>
    </div>
  </q-page>
</template>

<script>
import { SET_TITLE, MAIN_TOOLBAR } from "../mutations";
import { SettingKeys, settings } from "../lib/Configuration";
import { CashierSync } from "../lib/syncCashier";

export default {
  data: function() {
    return {
      currency: null,
      rootInvestmentAccount: null,
      serverUrl: ""
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Settings");

    this.loadSettings();
  },

  methods: {
    loadSettings() {
      settings.get(SettingKeys.currency).then(value => (this.currency = value));

      settings
        .get(SettingKeys.rootInvestmentAccount)
        .then(value => (this.rootInvestmentAccount = value));

      settings
        .get(SettingKeys.syncServerUrl)
        .then(value => (this.serverUrl = value));
    },
    onConnectClicked() {
      let sync = new CashierSync(this.serverUrl);
      sync
        .healthCheck()
        .then(response => this.$q.notify({ message: response }))
        .catch(reason =>
          this.$q.notify({ message: reason, color: "secondary" })
        );
    },
    onSaveClick() {
      // currency
      settings
        .set(SettingKeys.currency, this.currency)
        .then(() => this.$q.notify({ message: "currency saved" }));

      // root investment account
      settings
        .set(SettingKeys.rootInvestmentAccount, this.rootInvestmentAccount)
        .then(() =>
          this.$q.notify({ message: "root investment account saved" })
        );

      settings
        .set(SettingKeys.syncServerUrl, this.serverUrl)
        .then(() => this.$q.notify({ message: "sync server saved" }));
    }
  },

  components: {}
};
</script>
