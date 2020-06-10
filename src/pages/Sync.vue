<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>The synchronization is done with an instance of CashierSync.</p>
    <p>Make sure the Settings have been configured prior to synchronization.</p>

    <div class="text-right">
      <q-btn label="Settings" :to="{name: 'settings'}" color="secondary" text-color="accent" />
    </div>

    <div class="text-center">
      <q-list>
        <q-item>
          <!-- <q-item-label></q-item-label> -->
          <q-item-section>
            <q-checkbox
              v-model="syncBalances"
              dark
              label="Sync balances (ledger balance --flat --no-total). Deletes existing accounts and retrieves the list from Ledger."
            />
          </q-item-section>
        </q-item>
      </q-list>
      <q-item>
        <q-item-section>
          <q-checkbox
            v-model="syncAaValues"
            dark
            label="Sync asset allocation current values (ledger b ^<root> -X <CUR> --flat --no-total)"
          />
        </q-item-section>
      </q-item>

      <div class="q-mt-sm" />

      <q-btn label="Sync" color="secondary" text-color="accent" @click="synchronize" />
    </div>
    <div class="text-right">
      <q-btn label="Shutdown Server" color="secondary" text-color="accent" @click="shutdown" />
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
// import db from '../dataStore'
import { SettingKeys, settings } from "../lib/Configuration";
import { CashierSync } from "../lib/syncCashier";
import appService from "../appService";

export default {
  data() {
    return {
      syncBalances: true,
      syncAaValues: true
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
    synchronizeAaValues() {
      let sync = new CashierSync(this.serverUrl);
      sync
        .readCurrentValues()
        .then(() =>
          this.$q.notify({ message: "current values loaded", color: "primary" })
        )
        .catch(error =>
          this.$q.notify({ message: error.message, color: "secondary" })
        );
    },
    async synchronizeBalances() {
      let sync = new CashierSync(this.serverUrl);

      console.log("reading accounts from the server.");
      let newAccounts = await sync.readAccounts();
      // delete all accounts only after we have the new ones
      console.log("deleting local account records.");
      await appService.deleteAccounts();
      console.log("importing accounts.");
      await sync.importAccounts(newAccounts);
      this.$q.notify({ message: "balances loaded", color: "primary" });
    },
    async synchronize() {
      if (this.syncBalances) {
        // Delete all accounts, then get everything from Ledger.
        // This clears up accounts that still have a value in the app but Ledger does not
        // return them as their balance is 0.
        await this.synchronizeBalances().catch(error => {
          this.$q.notify({ message: error.message, color: "secondary" });
        });
      }
      if (this.syncAaValues) {
        this.synchronizeAaValues();
      }
    },
    shutdown() {
      let sync = new CashierSync(this.serverUrl);
      sync
        .shutdown()
        .catch(reason =>
          this.$q.notify({ message: "Error:" + reason, color: "secondary" })
        )
        .then(res =>
          this.$q.notify({
            message: "The server shutdown request sent.",
            color: "primary"
          })
        );
    }
  }
};
</script>
