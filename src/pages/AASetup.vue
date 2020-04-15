<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu" />

        <q-toolbar-title>AA Setup</q-toolbar-title>

        <q-space />

      </q-toolbar>
    </q-header>

    <!-- Current Balances -->
    <div class="q-my-md">
      <p>Current values</p>
      <p>These can be transferred using Synchronization or imported from "ledger b ^&lt;root&gt; -X &lt;CUR&gt; --flat"</p>
      <div class="row">
        <div class="col">
          <q-input type="file" class="text-red" dark clearable @input="onFileSelected" />
        </div>
        <div class="col text-center">
          <q-btn label="Import" color="red-10" text-color="amber-4" @click="onCurrentBalClick" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE, TOGGLE_DRAWER } from "../mutations";
import { SettingKeys } from "../lib/Configuration";
import appService from "../appService";
import { Setting } from "../model";

// const errorMessage = { color: "red-10", textColor: "amber-2" };

export default {
  data() {
    return {
      fileContent: null,
      rootAccount: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "AA Setup");

    this.loadData();
  },

  methods: {
    loadData() {
      appService.db.settings
        .get(SettingKeys.rootInvestmentAccount)
        .then(setting => {
          this.rootAccount = setting.value;
        });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onCurrentBalClick() {
      // engine
      //   .importCurrentValues(this.fileContent)
      //   .then(() => {
      //     this.$q.notify({ message: "Values imported" });
      //   })
      //   .catch(reason => {
      //     errorMessage.message = reason;
      //     this.$q.notify(errorMessage);
      //   });
    },
    onSaveClick() {
      let setting = new Setting(
        SettingKeys.rootInvestmentAccount,
        this.rootAccount
      );
      appService.db.settings.put(setting).then(result => {
        this.$q.notify({ message: "saved: " + result });
      });
    }
  },

  computed: {}
};
</script>
