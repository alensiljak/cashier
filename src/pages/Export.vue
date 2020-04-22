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
        @click="webshare" />
      </div>
      <div class="col text-center" ref="buttonContainer">
        <q-btn label="Download" color="red-10" text-color="amber-4" @click="downloadAsFile" />
        <!-- <a :href="downloadLink" download="journal.ledger" >Download</a> -->
      </div>
    </div>
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
      mdiShareVariant: null
    };
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
    copyToClipboard() {
      navigator.clipboard.writeText(this.output).then(() => {
        // console.log(res);
        this.$q.notify({ message: "data copied" });
      });
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
    webshare() {
      if (navigator.share) {
        navigator
          .share({
            title: "Cashier Transactions",
            // text: this.output
            // url: "https://web.dev/"
            url: this.output
          })
          .then(() => this.$q.notify({ message: "data copied" }))
          .catch(error => this.$q.notify({ message: "error:" + error }));
      }
    }
  },

  computed: {
    // downloadLink() {
    //   let result = "data:text/plain;base64,";
    //   result += btoa(this.output);
    //   return result;
    // }
  }
};
</script>
