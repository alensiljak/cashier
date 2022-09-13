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

    <textarea v-model="output" dark class="bg-colour1 text-amber-2 col-grow" />

    <footer class="row q-my-md justify-evenly">
      <q-btn
        label="Copy to clipboard"
        color="secondary"
        text-color="accent"
        @click="copyToClipboard"
      />
      <pcloud-save :filename="fileName" :content="output" />
      <div>
        <q-btn
          round
          :icon="mdiShareVariant"
          color="secondary"
          text-color="accent"
          @click="webshare"
        />
      </div>
      <q-btn
        ref="buttonContainer"
        label="Download"
        color="secondary"
        text-color="accent"
        @click="downloadAsFile"
      />
    </footer>
  </q-page>
</template>

<script lang="ts">
import appService from '../appService'
import { mdiShareVariant } from '@quasar/extras/mdi-v4'
import Toolbar from '../components/CashierToolbar.vue'
import moment from 'moment'
import FileSaver from 'file-saver'
import PcloudSave from 'src/components/pcloud-save.vue'

export default {
  components: {
    Toolbar,
    PcloudSave,
  },

  data() {
    return {
      output: '',
      mdiShareVariant: null,
      dataType: 'journal', // journal, scheduled
      title: 'Export',
      fileName: null,
    }
  },

  created() {
    this.loadData()

    // icons
    this.mdiShareVariant = mdiShareVariant
  },

  mounted() {
    this.fileName = this.getFilename()
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

      //const filename = this.getFilename()
      const filename = this.fileName
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
      // console.debug('data type:', dataType)

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
