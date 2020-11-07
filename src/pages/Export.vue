<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Export'" />

    <p>
      Export your data (journal in ledger format or scheduled transactions in
      JSON):
    </p>

    <q-input
      v-model="output"
      type="textarea"
      autogrow
      filled
      style="width: 100%; max-height: 90%"
      input-class="text-amber-2"
      color="primary"
    />

    <q-separator dark />

    <div class="row q-mt-lg">
      <div class="col text-center">
        <q-btn
          label="Copy to clipboard"
          color="secondary"
          text-color="accent"
          @click="copyToClipboard"
        />
      </div>
      <div class="col text-center">
        <q-btn
          round
          :icon="mdiShareVariant"
          color="secondary"
          text-color="accent"
          @click="webshare"
        />
      </div>
      <div ref="buttonContainer" class="col text-center">
        <q-btn
          label="Download"
          color="secondary"
          text-color="accent"
          @click="downloadAsFile"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { SettingKeys, settings } from '../lib/Configuration'
import appService from '../appService'
import { mdiShareVariant } from '@quasar/extras/mdi-v4'
import { CashierSync } from '../lib/syncCashier'
import Toolbar from '../components/Toolbar'
import moment from 'moment'

export default {
  components: {
    Toolbar,
  },
  data() {
    return {
      output: '',
      mdiShareVariant: null,
    }
  },

  created() {
    this.loadData()

    // icons
    this.mdiShareVariant = mdiShareVariant
  },

  methods: {
    confirmDeleteAll() {
      this.deleteAllTransactions()
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.output)
      this.$q.notify({ message: 'data copied' })
    },
    downloadAsFile() {
      let content = this.output
      var a = document.createElement('a')

      // filename
      const now = moment().format('YYYY-MM-DD_HH-mm')
      let filename = `cashier_export_${now}.ledger`
      a.download = filename

      let encoded = btoa(content)
      // a.href = "data:application/octet-stream;base64," + Base64.encode(this.output);
      a.href = 'data:text/plain;base64,' + encoded
      // charset=UTF-8;

      this.$refs.buttonContainer.appendChild(a)
      a.click()

      // cleanup?
      this.$refs.buttonContainer.removeChild(a)
    },
    async loadData() {
      // uses a route parameter for the type of data to load.
      const dataType = this.$route.params.type
      console.debug(dataType)
      let output = null

      if (!dataType) {
        // The default, old behaviour: use transactions
        output = await appService.exportTransactions()
      } else {
        switch (dataType) {
          case 'scheduled':
            output = await this.loadScheduledTransactions()
            break
        }
      }

      if (!output) output = ''
      this.output = output
    },
    async loadScheduledTransactions() {
      const collection = await appService.db.scheduled
        .orderBy('nextDate')
        .toArray()
      // console.debug(collection)
      const output = JSON.stringify(collection)
      return output
    },
    onDeleteAllClicked() {
      this.confirmDeleteAllVisible = true
    },
    webshare() {
      if (navigator.share) {
        navigator
          .share({
            title: 'Cashier Transactions',
            text: this.output,
            // url: "https://web.dev/"
            // url: this.output
          })
          .then(() => this.$q.notify({ message: 'data copied' }))
          .catch((error) => this.$q.notify({ message: 'error:' + error }))
      }
    },
  },
}
</script>

<style scoped>
a:visited {
  color: goldenrod;
}
</style>