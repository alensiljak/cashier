<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Export your journal in ledger format</p>

    <q-input
      type="textarea"
      v-model="output"
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
          color="red-10"
          text-color="amber-4"
          @click="copyToClipboard"
        />
      </div>
      <div class="col text-center">
        <q-btn round :icon="mdiShareVariant"
               color="red-10"
               text-color="amber-4"
               @click="webshare"
        />
      </div>
      <div ref="buttonContainer" class="col text-center">
        <q-btn label="Download" color="red-10" text-color="amber-4" @click="downloadAsFile" />
        <!-- <a :href="downloadLink" download="journal.ledger" >Download</a> -->
      </div>
    </div>

    <p class="q-my-lg">Clean-up</p>

    <div class="row q-mt-md">
      <q-btn label="Delete all local transactions" color="red-10" text-color="amber-4"
             @click="onDeleteAllClicked"
      />
    </div>

    <!-- delete all dialog -->
    <q-dialog v-model="confirmDeleteAllVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete all transactions?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="amber-4" />
          <q-btn v-close-popup flat label="Delete" color="amber-4" @click="confirmDeleteAll" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import appService from "../appService";
import { mdiShareVariant } from '@quasar/extras/mdi-v4'

export default {
  data() {
    return {
      output: "",
      mdiShareVariant: null,
      confirmDeleteAllVisible: false,
    };
  },

  computed: {
    // downloadLink() {
    //   let result = "data:text/plain;base64,";
    //   result += btoa(this.output);
    //   return result;
    // }
  },

  created() {
    this.$store.commit(SET_TITLE, "Export");
    this.$store.commit(MAIN_TOOLBAR, true);

    // load the transactions for export
    appService.exportTransactions().then(output => {
      // console.log("got the tx for export:", output);
      this.output = output;
    });

    // icons
    this.mdiShareVariant = mdiShareVariant
  },

  methods: {
    confirmDeleteAll() {
      this.deleteAllTransactions();
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.output).then(() => {
        // console.log(res);
        this.$q.notify({ message: "data copied" });
      });
    },
    /**
     * delete all transactions
     */
    deleteAllTransactions() {
      appService.deleteTransactions()
        .then(() => {
          this.$q.notify({ message: 'transactions deleted' })
          // this.loadData()
        })
        .catch(reason => this.$q.notify({ message: reason, color: 'danger' }))
    },
    downloadAsFile() {
      let content = this.output;
      var a = document.createElement("a");

      // filename
      let now = new Date();
      let filename = "export-";
      filename += now.toISOString().substring(0, 10);
      filename += "_";
      filename += ("" + now.getHours()).padStart(2, "0");
      filename += "-";
      filename += ("" + now.getMinutes()).padStart(2, "0");
      // filename += now.getTimezoneOffset()
      filename += ".ledger";
      a.download = filename;

      let encoded = btoa(content);
      // a.href = "data:application/octet-stream;base64," + Base64.encode(this.output);
      a.href = "data:text/plain;base64," + encoded;
      // charset=UTF-8;

      this.$refs.buttonContainer.appendChild(a);
      a.click();

      // cleanup?
      this.$refs.buttonContainer.removeChild(a);
    },
    onDeleteAllClicked() {
      this.confirmDeleteAllVisible = true;
    },
    webshare() {
      if (navigator.share) {
        navigator
          .share({
            title: "Cashier Transactions",
            text: this.output
            // url: "https://web.dev/"
            // url: this.output
          })
          .then(() => this.$q.notify({ message: "data copied" }))
          .catch(error => this.$q.notify({ message: "error:" + error }));
      }
    }
  }
};
</script>
