<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'CashierSync'" />

    <p>CashierSync needs to be running and accessible.</p>
    <p>
      To run locally, install cashiersync with pip and run. Configure ledger
      with .ledgerrc in the root Termux user folder.
    </p>

    <h4 class="q-my-md">Settings</h4>
    <div class="q-my-md row">
      <div class="col">
        <!-- server URL -->
        <q-input
          v-model="serverUrl"
          label="Server URL"
          dark
          @change="saveSyncServerUrl"
        />
      </div>

      <div class="col text-center">
        <q-btn
          label="Test"
          color="secondary"
          text-color="accent"
          @click="onConnectClicked"
        />
      </div>
    </div>

    <!-- <div class="text-right">
      <q-btn label="Settings" :to="{name: 'settings'}" color="secondary" text-color="accent" />
    </div> -->

    <h4 class="q-my-md">Synchronization</h4>
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

      <q-btn
        label="Sync"
        color="secondary"
        text-color="accent"
        @click="synchronize"
      />
    </div>

    <h4 class="q-my-md">Maintenance</h4>
    <div class="text-center">
      <q-btn
        label="Shutdown Server"
        color="secondary"
        text-color="accent"
        @click="shutdown"
      />
    </div>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import { SettingKeys, settings } from '../lib/Configuration'
import { CashierSync } from '../lib/syncCashier'
import appService from '../appService'

export default {
  components: {
    Toolbar
  },
  data() {
    return {
      syncBalances: true,
      syncAaValues: true,
      serverUrl: 'http://localhost:5000', // the default value
    }
  },

  created() {
    this.loadSettings()
  },

  methods: {
    async loadSettings() {
      this.serverUrl = await settings.get(SettingKeys.syncServerUrl)
      this.rootInvestmentAccount = await settings.get(
        SettingKeys.rootInvestmentAccount
      )
      this.currency = await settings.get(SettingKeys.currency)
    },
    onConnectClicked() {
      const sync = new CashierSync(this.serverUrl)
      sync
        .healthCheck()
        .then((response) =>
          this.$q.notify({ message: response, color: 'primary' })
        )
        .catch((reason) =>
          this.$q.notify({
            message: 'Connecting to CashierSync: ' + reason,
            color: 'secondary',
          })
        )
    },
    async saveSyncServerUrl() {
      // sync server.
      await settings.set(SettingKeys.syncServerUrl, this.serverUrl)
      this.$q.notify({ message: 'sync server saved' })
    },
    synchronizeAaValues() {
      const sync = new CashierSync(this.serverUrl)
      sync
        .readCurrentValues()
        .then(() =>
          this.$q.notify({
            message: 'Asset Allocation values loaded',
            color: 'primary',
          })
        )
        .catch((error) =>
          this.$q.notify({ message: error.message, color: 'secondary' })
        )
    },
    async synchronizeBalances() {
      const sync = new CashierSync(this.serverUrl)

      /// Accounts

      console.log('reading accounts from the server...')
      const ledgerAccounts = await sync.readAccounts()

      // delete all accounts only after we have the new ones
      console.log('deleting local account records...')
      await appService.deleteAccounts()

      console.log('importing accounts...')
      await appService.importAccounts(ledgerAccounts)
      this.$q.notify({ message: 'accounts loaded', color: 'primary' })

      /// Balances

      // synchronize the account balances
      console.log('importing balances...')
      const balances = await sync.readBalances()
      //console.log(balances)
      await appService.importBalanceSheet(balances)
      this.$q.notify({ message: 'balances loaded', color: 'primary' })
    },

    async synchronize() {
      if (this.syncBalances) {
        // Delete all accounts, then get everything from Ledger.
        // This clears up accounts that still have a value in the app but Ledger does not
        // return them as their balance is 0.
        try {
          await this.synchronizeBalances()
        } catch (error) {
          this.$q.notify({ message: error.message, color: 'secondary' })
        }
      }
      if (this.syncAaValues) {
        this.synchronizeAaValues()
      }
    },
    shutdown() {
      const sync = new CashierSync(this.serverUrl)
      sync
        .shutdown()
        .catch((reason) =>
          this.$q.notify({ message: 'Error:' + reason, color: 'secondary' })
        )
        .then((res) =>
          this.$q.notify({
            message: 'The server shutdown request sent.',
            color: 'primary',
          })
        )
    },
  },
}
</script>
