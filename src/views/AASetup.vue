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

    <div>
      <p>Asset Allocation Setup</p>
    </div>

    <div>
      <q-input label="Root investment account to use" v-model="rootAccount" dark/>
    </div>

    <div class="q-my-md text-right">
      <q-btn label="Save" color="red-10" text-color="amber-4" @click="onSaveClick"/>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE, TOGGLE_DRAWER } from "../mutations";
import {SettingKeys} from '../Configuration'
import appService from '../appService'
import {Setting} from '../model'

export default {
  data() {
    return {
      rootAccount: null
    }
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "AA Setup");

    // this.dlPrice()
    this.loadData()
  },

  methods: {
    loadData() {
      appService.db.settings.get(SettingKeys.assetAllocationInvestmentRootAccount).then(setting => {
        this.rootAccount = setting.value
      })
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onHelpClick() {
      // todo navigate to help page
      this.$router.push({ name: 'assetallocationsetuphelp' })
    },
    onSaveClick() {
      let setting = new Setting(SettingKeys.assetAllocationInvestmentRootAccount, this.rootAccount)
      appService.db.settings.put(setting).then(result => {
        this.$q.notify({message: 'saved: ' + result})
      })
    }
  },

  computed: {
  }
};
</script>
