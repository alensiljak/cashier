<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div class="row">
      <div class="col">
        <!-- currency -->
        <q-input dark label="Main Currency" v-model="currency" />
      </div>
    </div>
    <p class="q-my-md">Investments</p>
    <div class="row">
      <div class="col">
        <!-- root investment account -->
        <q-input dark label="Root investment account" v-model="rootInvestmentAccount" />
      </div>
    </div>

    <p class="q-my-md">Synchronization</p>
    <div class="q-my-md row">
      <div class="col">
        <!-- server URL -->
        <q-input v-model="serverUrl" label="Server URL" dark />
      </div>

      <div class="col text-center">
        <q-btn label="Test" @click="onConnectClicked" color="secondary" text-color="accent" />
      </div>
    </div>

    <p class="q-my-md">Asset Allocation settings</p>
    <div class="row">
      <!-- <div class="col text-center">
        <q-btn
          :to="{name: 'assetallocationsetup'}"
          label="Asset Allocation configuration"
          color="secondary"
          text-color="accent"
        />
      </div>-->

      <!-- AA definition -->
      <!-- <div class="q-mb-md"> -->
      <!-- <p>Asset Allocation Definition</p> -->
      <div class="col">
        <q-input type="file" class="text-red" dark clearable @input="onAaFileSelected" />
      </div>
      <div class="col text-center">
        <q-btn label="Import" color="red-10" text-color="amber-4" @click="onDefinitionImportClick" />
      </div>
      <!-- </div> -->
    </div>

    <div class="row q-mt-lg">
      <div class="col text-center q-my-lg">
        <q-btn @click="onSaveClick" label="save" color="secondary" text-color="accent" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { SET_TITLE, MAIN_TOOLBAR } from "../mutations";
import { SettingKeys, settings } from "../lib/Configuration";
import { CashierSync } from "../lib/syncCashier";
import { engine } from "../lib/AssetAllocation";

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
    /**
     * The Asset Allocation definition selected.
     */
    onAaFileSelected(files) {
      this.readInputFile(files[0], "fileContent");
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
    onDefinitionImportClick() {
      // import AA definition file
      engine.importDefinition(this.fileContent).then(() => {
        this.$q.notify({
          message: "Definition imported",
          color: "teal-9", // green-9
          textColor: "amber-2"
        });
      });
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

      // sync server.
      settings
        .set(SettingKeys.syncServerUrl, this.serverUrl)
        .then(() => this.$q.notify({ message: "sync server saved" }));
    },
    /**
     * Load Asset Allocation from the file.
     */
    readInputFile(fileInfo, dataField) {
      //   console.log(fileInfo);
      var reader = new FileReader();

      reader.onload = event => {
        // File was successfully read.
        var content = event.target.result;

        if (dataField) {
          this[dataField] = content;
          //   console.log("read", content);
        }
      };

      reader.readAsText(fileInfo);
    }
  },

  components: {}
};
</script>
