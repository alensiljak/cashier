<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Settings'" />

    <div class="row">
      <div class="col">
        <!-- currency -->
        <q-input v-model="currency" dark label="Main Currency" />
      </div>
    </div>
    <p class="q-my-md">Investments</p>
    <div class="row">
      <div class="col">
        <!-- root investment account -->
        <q-input
          v-model="rootInvestmentAccount"
          dark
          label="Root investment account"
        />
      </div>
    </div>

    <p class="q-my-md">Asset Allocation settings</p>
    <div class="row">
      <div class="col">
        <q-input
          type="file"
          class="text-red"
          dark
          clearable
          @input="onAaFileSelected"
        />
      </div>
      <div class="col text-center">
        <q-btn
          label="Import"
          color="secondary"
          text-color="accent"
          @click="onDefinitionImportClick"
        />
      </div>
      <div class="col-1">
        <q-btn flat round dense @click="onAaHelpClick">
          <font-awesome-icon icon="question-circle" />
        </q-btn>
      </div>
      <!-- </div> -->
    </div>

    <div class="row">
      <div class="col">
        <q-checkbox v-model="rememberLastTransaction" dark
                    label="Remember last transaction for payees. Fills the new transactions."
        />
      </div>
    </div>

    <div class="row q-mt-lg">
      <div class="col text-center q-my-lg">
        <q-btn
          label="save"
          color="secondary"
          text-color="accent"
          @click="onSaveClick"
        />
      </div>
    </div>

    <hr>

    <div class="row q-mt-lg">
      <div class="col text-center q-my-lg">
        <p>
          Force-reload the page to refresh the version in case the background
          worker does not manage to update to the latest version.
        </p>
        <q-btn
          label="Reload App"
          color="secondary"
          text-color="accent"
          @click="reloadApp"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { SettingKeys, settings } from '../lib/Configuration'
import { engine } from '../lib/AssetAllocation'
import Toolbar from '../components/Toolbar'
import appService from '../appService'

export default {
  components: {
    Toolbar,
  },
  data: function () {
    return {
      currency: null,
      rootInvestmentAccount: null,
      fileContent: null,
      rememberLastTransaction: null
    }
  },

  created() {
    this.loadSettings()
  },

  methods: {
    async loadSettings() {
      this.currency = await settings.get(SettingKeys.currency)
      this.rootInvestmentAccount = await settings.get(
        SettingKeys.rootInvestmentAccount
      )
      this.rememberLastTransaction = await settings.get(SettingKeys.rememberLastTransaction)
    },
    /**
     * The Asset Allocation definition selected.
     */
    onAaFileSelected(files) {
      appService.readFile(files[0], this.onFileRead)
    },
    onAaHelpClick() {
      // navigate to help page
      this.$router.push({ name: 'assetallocationsetuphelp' })
    },
    async onDefinitionImportClick() {
      // Clean-up any existing data first.
      await engine.emptyData()
      // import AA definition file
      await engine.importDefinition(this.fileContent)
      //await engine.importYamlDefinition(this.fileContent)
      this.$q.notify({ message: 'Definition imported', color: 'positive', })

      // .catch((msg) =>
      //   this.$q.notify({
      //     message: "Error during import: " + msg,
      //     color: "secondary",
      //     textColor: "amber-2",
      //   })
      // );
    },
    onFileRead(content) {
      this.fileContent = content
    },
    async onSaveClick() {
      // currency
      await settings.set(SettingKeys.currency, this.currency)

      // root investment account
      await settings.set(
        SettingKeys.rootInvestmentAccount,
        this.rootInvestmentAccount
      )

      await settings.set(SettingKeys.rememberLastTransaction, this.rememberLastTransaction)

      this.$q.notify({ message: 'Settings saved', color: 'positive' })
    },
    reloadApp() {
      window.location.reload(true)
    },
  },
}
</script>
