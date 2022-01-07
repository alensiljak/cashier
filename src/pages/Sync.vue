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
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onSyncClicked"
      >
        <font-awesome-icon
          icon="sync-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Sync
      </q-btn>
    </div>


    <div class="row q-my-lg">
      <div class="col">
        <q-btn label="Cache API" color="accent" text-color="secondary" to="cache" />
      </div>
    </div>

    <hr>

    <!-- <h4 class="q-my-md">Maintenance</h4>
    <div class="text-center">
      <q-btn
        label="Shutdown Server"
        color="secondary"
        text-color="accent"
        @click="shutdown"
      />
    </div> -->
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import { SettingKeys, settings } from '../lib/Configuration'
import { CashierSync } from '../lib/syncCashier'
import appService from '../appService'

export default {
  components: {
    Toolbar,
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
    async onConnectClicked() {
      const sync = new CashierSync(this.serverUrl)
      try {
        const response = await sync.healthCheck()

        this.$q.notify({ message: response, color: 'positive' })
      } catch (err) {
        this.$q.notify({
          message: 'Connecting to CashierSync: ' + err.message,
          color: 'negative',
        })
      }
    },
    async saveSyncServerUrl() {
      // sync server.
      await settings.set(SettingKeys.syncServerUrl, this.serverUrl)

      this.$q.notify({ message: 'sync server saved', color: 'info' })
    },
    async synchronizeAaValues() {
      const sync = new CashierSync(this.serverUrl)
      try {
        await sync.readCurrentValues()

        this.$q.notify({
          message: 'Asset Allocation values loaded',
          color: 'primary',
        })
      } catch (error) {
        this.$q.notify({ message: error.message, color: 'secondary' })
      }
    },
    async syncAccounts() {
      const sync = new CashierSync(this.serverUrl)

      /// Accounts

      console.debug('reading accounts from the server...')
      const ledgerAccounts = await sync.readAccounts()

      // delete all accounts only after we have retrieved the new ones.
      //console.debug('deleting local account records...')
      await appService.deleteAccounts()

      //console.debug('importing accounts...')
      await appService.importAccounts(ledgerAccounts)
      this.$q.notify({ message: 'accounts loaded', color: 'primary' })
    },
    /**
     * Loads all accounts (ledger accounts) + balances (ledger balance)
     */
    async synchronizeBalances() {
      const sync = new CashierSync(this.serverUrl)

      /// Balances

      // Import the account balances.
      console.debug('importing balances...')
      const balances = await sync.readBalances()
      await appService.importBalanceSheet(balances)
      this.$q.notify({ message: 'balances loaded', color: 'primary' })
    },
    async onSyncClicked() {
      try {
        await this.syncAccounts()
        
        if (this.syncBalances) {
          // Accounts + balances
          await this.synchronizeBalances()
        }
        // Investment account balances in base currency, for Asset Allocation.
        if (this.syncAaValues) {
          await this.synchronizeAaValues()
        }
      } catch (error) {
        this.$q.notify({ message: error.message, color: 'negative' })
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
