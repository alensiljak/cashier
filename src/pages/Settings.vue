<template>
  <q-page padding class="bg-colour1 text-colour2">
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
          color="red-10"
          text-color="amber-4"
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

    <div class="row q-my-lg">
      <div class="col">
        <router-link to="cache">Cache API</router-link>
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
import { SET_TITLE, MAIN_TOOLBAR } from "../mutations";
import { SettingKeys, settings } from "../lib/Configuration";
// import { CashierSync } from "../lib/syncCashier";
import { engine } from "../lib/AssetAllocation";

export default {
  components: {},
  data: function () {
    return {
      currency: null,
      rootInvestmentAccount: null,
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Settings");

    this.loadSettings();
  },

  methods: {
    async loadSettings() {
      this.currency = await settings.get(SettingKeys.currency);
      this.rootInvestmentAccount = await settings.get(
        SettingKeys.rootInvestmentAccount
      );
    },
    /**
     * The Asset Allocation definition selected.
     */
    onAaFileSelected(files) {
      this.readInputFile(files[0], "fileContent");
    },
    onAaHelpClick() {
      // navigate to help page
      this.$router.push({ name: "assetallocationsetuphelp" });
    },
    async onDefinitionImportClick() {
      // Clean-up any existing data first.
      await engine.emptyData();
      // import AA definition file
      await engine.importDefinition(this.fileContent);
      this.$q.notify({
        message: "Definition imported",
        color: "teal-9", // green-9
        textColor: "amber-2",
      });

      // .catch((msg) =>
      //   this.$q.notify({
      //     message: "Error during import: " + msg,
      //     color: "secondary",
      //     textColor: "amber-2",
      //   })
      // );
    },
    async onSaveClick() {
      // currency
      await settings.set(SettingKeys.currency, this.currency);
      this.$q.notify({ message: "currency saved" });

      // root investment account
      await settings.set(
        SettingKeys.rootInvestmentAccount,
        this.rootInvestmentAccount
      );
      this.$q.notify({ message: "root investment account saved" });
    },
    /**
     * Load Asset Allocation from the file.
     */
    readInputFile(fileInfo, dataField) {
      //   console.log(fileInfo);
      var reader = new FileReader();

      reader.onload = (event) => {
        // File was successfully read.
        var content = event.target.result;

        if (dataField) {
          this[dataField] = content;
          //   console.log("read", content);
        }
      };

      reader.readAsText(fileInfo);
    },
    reloadApp() {
      window.location.reload(true);
    },
  },
};
</script>
