<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Export'" />

    <p>Export your journal in ledger format</p>

    <q-input
      v-model="output"
      type="textarea"
      autogrow
      filled
      style="width: 100%; max-height: 90%"
      input-class="text-amber-2"
      color="teal-9"
    />

    <div class="row q-mt-md">
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
        <!-- <a :href="downloadLink" download="journal.ledger" >Download</a> -->
      </div>
    </div>

    <!-- clean-up -->
    <q-card bordered dark class="q-mt-md q-pa-sm text-colour2 q-mb-md">
      <p class="q-my-md">Clean-up</p>

      <div class="row q-mt-md">
        <q-btn
          label="Delete all local transactions"
          color="secondary"
          text-color="accent"
          @click="onDeleteAllClicked"
        />
      </div>
    </q-card>

    <!-- delete all dialog -->
    <q-dialog
      v-model="confirmDeleteAllVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <span>Do you want to delete all transactions?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="accent"
            @click="confirmDeleteAll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { SettingKeys, settings } from '../lib/Configuration'
import appService from '../appService'
import { mdiShareVariant } from '@quasar/extras/mdi-v4'
import { CashierSync } from '../lib/syncCashier'
import Toolbar from '../components/Toolbar'

export default {

  components: {
    Toolbar
  },
  data() {
    return {
      output: '',
      mdiShareVariant: null,
      confirmDeleteAllVisible: false,
      // export to journal
      serverUrl: null,
      journalFile: null,
    }
  },

  created() {
    this.loadSettings()
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
    /**
     * delete all transactions
     */
    async deleteAllTransactions() {
      try {
        await appService.deleteTransactions()
        this.$q.notify({ message: 'transactions deleted' })
        await this.loadData()
      } catch (reason) {
        this.$q.notify({ message: reason, color: 'danger' })
      }
    },
    downloadAsFile() {
      let content = this.output
      var a = document.createElement('a')

      // filename
      let now = new Date()
      let filename = 'export-'
      filename += now.toISOString().substring(0, 10)
      filename += '_'
      filename += ('' + now.getHours()).padStart(2, '0')
      filename += '-'
      filename += ('' + now.getMinutes()).padStart(2, '0')
      // filename += now.getTimezoneOffset()
      filename += '.ledger'
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
      // load the transactions for export
      let output = await appService.exportTransactions()
      // console.log("got the tx for export:", output);
      if (!output) output = ''
      this.output = output
    },
    async loadSettings() {
      let value = await settings.get(SettingKeys.syncServerUrl)
      this.serverUrl = value

      // value = await settings.get(SettingKeys.writeableJournalFilePath)
      // this.journalFile = value
    },
    onDeleteAllClicked() {
      this.confirmDeleteAllVisible = true
    },
    // async onJournalPathChange() {
    //   await settings.set(SettingKeys.writeableJournalFilePath, this.journalFile)
    //   this.$q.notify({ message: 'Writeable journal file path saved.' })
    // },
    // async onSaveClick() {
    //   // validation
    //   // the output file must be configured
    //   if (!this.journalFile) {
    //     const message = 'The writeable journal file must be configured!'
    //     this.$q.notify({ message: message, color: 'secondary' })
    //     return
    //   }
    //   // save to file
    //   try {
    //     const sync = new CashierSync(this.serverUrl)
    //     let result = await sync.append(this.journalFile, this.output)
    //     this.$q.notify({ message: result, color: 'primary' })
    //   } catch (error) {
    //     this.$q.notify({ message: error, color: 'secondary' })
    //   }
    // },
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
  }
}
</script>

<style scoped>
a:visited {
  color: goldenrod;
}
</style>