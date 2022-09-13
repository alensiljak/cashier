<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'AA Setup'" />

    <!-- Current Balances -->
    <div class="q-my-md">
      <p>Current values</p>
      <p>
        These can be transferred using Synchronization or imported from "ledger
        b ^&lt;root&gt; -X &lt;CUR&gt; --flat"
      </p>
      <div class="row">
        <div class="col">
          <q-input
            type="file"
            class="text-red"
            dark
            clearable
            @input="onFileSelected"
          />
        </div>
        <div class="col text-center">
          <q-btn
            label="Import"
            color="secondary"
            text-color="accent"
            @click="onCurrentBalClick"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Toolbar from '../components/CashierToolbar.vue'
</script>
<script>
import { SettingKeys } from '../lib/Configuration'
import appService from '../appService'
import { Setting } from '../model'

// const errorMessage = { color: "secondary", textColor: "amber-2" };

export default {
  data() {
    return {
      fileContent: null,
      rootAccount: null,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const setting = await appService.db.settings.get(
        SettingKeys.rootInvestmentAccount
      )
      this.rootAccount = setting.value
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
      )
      appService.db.settings.put(setting).then((result) => {
        this.$q.notify({ message: 'saved: ' + result })
      })
    },
  },
}
</script>
