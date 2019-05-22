<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Here you can export your register in ledger format</p>
    <q-input
      type="textarea"
      v-model="output"
      autogrow
      filled
      style="width: 100%; max-height: 90%"
      input-class="text-amber-2"
      color="red"
    />

    <div class="row">
      <div class="col text-center">
        <q-btn
          label="Copy to clipboard"
          color="red-10"
          text-color="amber-4"
          @click="copyToClipboard"
        />
      </div>
      <div class="col text-center" ref="buttonContainer">
        <q-btn label="Download" color="red-10" text-color="amber-4" @click="downloadAsFile"/>
        <!-- <a :href="downloadLink" download="journal.ledger" >Download</a> -->
      </div>
    </div>
  </q-page>
</template>

<script>
import appService from "../appService";
import { Notify } from "quasar";

export default {
  data() {
    return {
      output: ""
    };
  },

  created() {
    // todo export the register from here
    appService.exportTransactions().then(output => {
      //console.log("got the tx for export:", output);
      this.output = output;
    });
  },

  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.output).then(() => {
        // console.log(res);
        Notify.create({ message: "data copied" });
      });
    },
    downloadAsFile() {
      var a = document.createElement("a");
      
      // filename
      let now = new Date()
      let filename = 'export-'
      filename += now.toISOString().substring(0,10)
      filename += '_'
      filename += now.getHours()
      filename += '-'
      filename += now.getMinutes()
      // filename += now.getTimezoneOffset()
      filename += '.ledger'
      a.download = filename;

      let encoded = btoa(this.output);
      //a.href = "data:application/octet-stream;base64," + Base64.encode(this.output);
      a.href = "data:text/plain;base64," + encoded;
      // charset=UTF-8;

      this.$refs.buttonContainer.appendChild(a)
      a.click();

      // cleanup?
      this.$refs.buttonContainer.removeChild(a)
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
