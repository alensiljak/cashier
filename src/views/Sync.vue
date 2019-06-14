<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>The synchronization is done with an instance of CashierSync.</p>
    <p>Make sure the Settings have been configured prior to synchronization.</p>

    <div class="text-right">
      <q-btn label="Settings" :to="{name: 'settings'}" color="secondary" text-color="accent"/>
    </div>

    <div class="text-center">
      <q-list>
        <q-item>
          <!-- <q-item-label></q-item-label> -->
          <q-item-section>
            <q-checkbox
              dark
              v-model="syncBalances"
              label="Sync balances (ledger balance --flat --no-total)"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <q-item>
        <q-item-section>
          <q-checkbox
            dark
            v-model="syncAaValues"
            label="Sync asset allocation current values (ledger b ^<root> -X <CUR> --flat --no-total)"
          />
        </q-item-section>
      </q-item>

      <div class="q-mt-sm"/>

      <q-btn label="Sync" color="secondary" text-color="accent" @click="synchronize"/>
    </div>

    <!-- <div>
      <q-input dark type="textarea" v-model="content"/>
    </div>
    <div>
      <q-btn @click="onSaveClicked" label="save" color="secondary" text-color="accent"/>
      <q-btn @click="onLoadClick" label="load" color="secondary" text-color="accent"/>
    </div>-->
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
// import db from '../dataStore'
import { SettingKeys, settings } from "../lib/Configuration";

export default {
  data() {
    return {
      syncBalances: true,
      syncAaValues: true,
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

      settings
        .get(SettingKeys.rootInvestmentAccount)
        .then(value => (this.rootInvestmentAccount = value));
      settings.get(SettingKeys.currency).then(value => (this.currency = value));
    },
    // onCurrencyChange() {
    //   settings.set(SettingKeys.currency, this.currency).then(result => {
    //     console.log("saved currency", result);
    //   });
    // },
    // onLoadClick() {
    //   this.loadSettings();
    // },
    // onServerUrlChanged() {
    //   // save settings
    //   settings.set(SettingKeys.syncServerUrl, this.serverUrl).then(() => {
    //     this.$q.notify("server URL saved");
    //   });
    // },
    synchronizeAaValues() {
      let sync = new CashierSync(this.serverUrl);
      sync
        .readCurrentValues()
        .then(() =>
          this.$q.notify({ message: "current values loaded", color: "primary" })
        )
        .catch(reason =>
          this.$q.notify({ message: reason, color: "secondary" })
        );
    },
    synchronizeBalances() {
      let sync = new CashierSync(this.serverUrl);

      sync
        .readAccounts()
        .then(() =>
          this.$q.notify({ message: "balances loaded", color: "primary" })
        )
        .catch(reason =>
          this.$q.notify({ message: reason, color: "secondary" })
        );
    },
    synchronize() {
      if (this.syncBalances) {
        this.synchronizeBalances();
      }
      if (this.syncAaValues) {
        this.synchronizeAaValues();
      }
    }
  }
};
</script>
