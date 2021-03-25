<template>
  <q-page padding class="bg-colour1 text-colour2 column">
    <toolbar :title="title" />

    <div>
      <p>Export your data - {{ dataType }}:</p>
      <p>
        Note: Journal is exported in ledger format, Scheduled Transactions in
        JSON.
      </p>
    </div>

    <!-- <q-input
      v-model="output"
      type="textarea"
      class="col-grow"
      outlined
      dark
      input-class="text-amber-2"
      color="primary"
    /> -->
    <!-- autogrow -->
    <textarea v-model="output" dark class="bg-colour1 text-colour2 col-grow">
    </textarea>

    <!-- <q-separator dark /> -->

    <div class="row q-my-lg footer">
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
import Toolbar from '../components/Toolbar'
import moment from 'moment'
import FileSaver from 'file-saver'

export default {
  components: {
    Toolbar,
  },

  data() {
    return {
      output: '',
      mdiShareVariant: null,
      dataType: 'journal', // journal, scheduled
      title: 'Export',
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
      this.$q.notify({ message: 'data copied', color: 'positive' })
    },

    downloadAsFile() {
      // use FileSaver

      const filename = this.getFilename()
      const content = this.output

      var blob = new Blob([content], {
        type: 'text/plain;charset=utf-8',
      })
      FileSaver.saveAs(blob, filename)
    },

    /**
     * This was the original implementation but it stopped working in Firefox on Android.
     */
    downloadAsFile_orig() {
      const filename = this.getFilename()

      var a = document.createElement('a')

      a.download = filename

      const content = this.output
      let encoded = btoa(content)
      // a.href = "data:application/octet-stream;base64," + Base64.encode(this.output);
      a.href = 'data:text/plain;base64,' + encoded
      // charset=UTF-8;

      this.$refs.buttonContainer.appendChild(a)
      a.click()

      // cleanup?
      this.$refs.buttonContainer.removeChild(a)
    },

    getFilename() {
      // create the file name for the downloaded export file.
      let extension = this.getFileExtension()
      // filename
      const now = moment().format('YYYY-MM-DD_HH-mm')
      let filename = `cashier_${this.dataType}_${now}.${extension}`
      return filename
    },

    getFileExtension() {
      // extension
      let extension = 'txt'

      switch (this.dataType) {
        case 'journal':
          extension = 'ledger'
          break
        case 'scheduled':
          extension = 'json'
          break
      }
      return extension
    },

    async loadData() {
      // uses a route parameter for the type of data to load.
      let dataType = this.$route.params.type
      console.debug(dataType)
      if (dataType) {
        this.dataType = dataType
      } else {
        // use default
        dataType = this.dataType
      }
      this.title = `${this.title} ${dataType}`

      let output = null

      switch (dataType) {
        case 'journal':
          // The default, old behaviour: use transactions
          output = await appService.getExportTransactions()
          break
        case 'scheduled':
          output = await this.loadScheduledTransactions()
          break
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

    webshare() {
      if (navigator.share) {
        navigator
          .share({
            title: 'Cashier Transactions',
            text: this.output,
            // url: "https://web.dev/"
            // url: this.output
          })
          .then(() =>
            this.$q.notify({ message: 'data copied', color: 'positive' })
          )
          .catch((error) =>
            this.$q.notify({
              message: 'error:' + error.message,
              color: 'negative',
            })
          )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.output-box {
  height: 100%;
}

a:visited {
  color: goldenrod;
}
</style>
