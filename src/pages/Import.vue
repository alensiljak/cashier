<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'Import'" />

    <ul>
      <li>
        For account balances, export the balance sheet with "ledger balance
        --flat --no-total".
      </li>
      <li>Export commodities with "ledger commodities"</li>
    </ul>
    <p>Import the text file</p>
    <q-input class="text-red" clearable type="file" @input="onFileSelected" />
    <!-- v-on:dragover="onFileHover"
    v-on:change="onFileSelected"-->
    <p class="q-mt-sm">or paste into the box below</p>
    <q-input v-model="content" type="textarea" outlined />

    <!-- <div class="q-mt-sm"/> -->
    <p class="q-mt-sm">Click the appropriate button to import:</p>

    <div class="row text-center q-mt-sm">
      <div class="col text-center">
        <q-btn :disable="clicked" color="secondary" text-color="accent" @click="onImportBalanceClick">
          <icon-wallet class="on-left" />
          Accounts
        </q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col text-center">
        <q-btn disable color="secondary" text-color="accent">
          <icon-users class="on-left" />
          Payees
        </q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col text-center">
        <q-btn color="secondary" text-color="accent" :disable="clicked" @click="importCommoditiesClick">
          <icon-boxes class="on-left" />
          Commodities
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Toolbar from '../components/CashierToolbar.vue'
import { Boxes as IconBoxes, Users as IconUsers, Wallet as IconWallet } from 'lucide-vue-next'

</script>
<script lang="ts">
import appService from '../appService'

export default {
  data() {
    return {
      content: null,
      clicked: false, // indicates if a button was pressed
    }
  },

  created() { },

  methods: {
    importCommoditiesClick() {
      this.clicked = true

      appService.importCommodities(this.content).then(() => {
        this.$router.push({ name: 'commodities' })
      })
    },
    onImportBalanceClick() {
      this.clicked = true

      appService.importBalanceSheet(this.content).then(() => {
        // this.$q.notify({ color: "teal-9", message: "Accounts imported" });
        this.$router.push({ name: 'accounts' })
      })
    },
    onFileSelected(files) {
      this.readInputFile(files[0], 'content')
    },
    onFileHover(evt) {
      evt.stopPropagation()
      evt.preventDefault()
      evt.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
    },
    readInputFile(fileInfo, dataField) {
      //   console.log(fileInfo);
      var reader = new FileReader()

      reader.onload = (event) => {
        // File was successfully read.
        var content = event.target.result

        if (dataField) {
          this[dataField] = content
          //   console.log("read", content);
        }
      }

      reader.readAsText(fileInfo)
    },
  },
}
</script>
