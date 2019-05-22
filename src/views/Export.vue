<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Here you can export your register in ledger format</p>
    <q-input type="textarea" v-model="output" autogrow filled
        style="width: 100%; max-height: 90%" 
        input-class="text-amber-2" color="red" />

    <q-btn label="Copy to clipboard" color="red-10" text-color="amber-4" @click="copyToClipboard" />
  </q-page>
</template>

<script>
import appService from "../appService";
import { Notify } from 'quasar'

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
      this.output = output
    });
  },

  methods: {
      copyToClipboard() {
          navigator.clipboard.writeText(this.output).then(res => {
              console.log(res)
              Notify.create({ message: 'data copied'})
          })
      }
  }
};
</script>
