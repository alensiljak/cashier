<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>AA Setup</q-toolbar-title>

        <q-space/>

        <q-btn flat round dense @click="onHelpClick">
          <font-awesome-icon icon="question-circle"/>
        </q-btn>
      </q-toolbar>
    </q-header>
    
    <!-- AA definition -->
    <div class="q-mb-md">
      <p>Asset Allocation Definition</p>
      <div class="row">
        <div class="col">
          <q-input type="file" class="text-red" dark clearable @input="onFileSelected"/>
        </div>
        <div class="col text-center">
          <q-btn
            label="Import"
            color="red-10"
            text-color="amber-4"
            @click="onDefinitionImportClick"
          />
        </div>
      </div>
    </div>

    <!-- Root investment account -->
    <div class="row">
      <div class="col">
        <q-input label="Root investment account to use" v-model="rootAccount" dark/>
      </div>
      <div class="q-my-md text-center col">
        <q-btn label="Save" color="red-10" text-color="amber-4" @click="onSaveClick"/>
      </div>
    </div>

    <div class="q-my-md">
      <p>Current values, import from "ledger b ^&lt;root&gt; -X &lt;CUR&gt; --flat"</p>
      <div class="row">
        <div class="col">input</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE, TOGGLE_DRAWER } from "../mutations";
import { SettingKeys } from "../lib/Configuration";
import appService from "../appService";
import { Setting } from "../model";
import { engine } from "../lib/AssetAllocation";

export default {
  data() {
    return {
      aaDefinitionContent: null,
      rootAccount: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "AA Setup");

    // this.dlPrice()
    this.loadData();
  },

  methods: {
    loadData() {
      appService.db.settings
        .get(SettingKeys.assetAllocationInvestmentRootAccount)
        .then(setting => {
          this.rootAccount = setting.value;
        });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onDefinitionImportClick() {
      // import AA definition file
      engine.importDefinition(this.aaDefinitionContent).then(() => {
        this.$q.notify({message: 'Definition imported', color: 'green-9'})
      })
    },
    onFileSelected(files) {
      this.readInputFile(files[0], "aaDefinitionContent");
    },
    onHelpClick() {
      // navigate to help page
      this.$router.push({ name: "assetallocationsetuphelp" });
    },
    onSaveClick() {
      let setting = new Setting(
        SettingKeys.assetAllocationInvestmentRootAccount,
        this.rootAccount
      );
      appService.db.settings.put(setting).then(result => {
        this.$q.notify({ message: "saved: " + result });
      });
    },
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

  computed: {}
};
</script>
