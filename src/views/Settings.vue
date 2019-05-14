<template>
  <div>
    <h1>Settings</h1>
    <p>Here you can import the data required for the operation.</p>

    <div>
      <h2>Balances</h2>
      <p>
        Loading a balance sheet will provide the accounts list, their balances,
        and commodities/currencies. Export from Ledger with "ledger balances".
      </p>
      <input
        type="file"
        class="form-control-input"
        v-on:dragover="onFileHover"
        v-on:change="onBalancesFile"
      >
      <div class="form-row">
        <textarea v-model="balanceSheetContent"></textarea>
      </div>
    </div>

    <h2>Payees</h2>

    <div class="mt-3">
      <p>
        Load payees from Ledger. Export with "ledger payees". Then either select a file or paste
        the contents into the box below.
      </p>
      <!-- <div id="drop_zone" v-on:dragover="onFileHover">Drop files here</div> -->
      <div class="form-row">
        <div class="col">
          <input
            id="payeesFile"
            class="form-control-file"
            type="file"
            v-on:dragover="onFileHover"
            v-on:change="onPayeesFile"
          >
        </div>
        <div class="col text-right">
          <button type="button" class="btn btn-info" v-on:click="onDummyPayeesClick">Dummy data</button>
        </div>
      </div>
      <div class="form-row">
        <textarea v-model="payeesContent"></textarea>
      </div>

      <div class="text-center mt-1 mb-5">
        <button type="button" class="btn btn-primary" v-on:click="onPayeesImport">Import Payees</button>
      </div>
    </div>
  </div>
</template>
<script>
import PayeeImporter from "../components/PayeeImporter";
import { SET_PAYEES } from "../mutations";

export default {
  data: function() {
    return {
      balanceSheetContent: null,
      payeesContent: null
    };
  },
  methods: {
    onBalancesFile: function(event) {
      this.readFileContent(event, "balanceSheetContent");
    },
    onPayeesFile: function(event) {
      this.readFileContent(event, "payeesContent");
    },
    onFileHover: function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
    },
    onDummyPayeesClick: function() {
      // use some dummy data
      this.payeesContent = "Payee 1\nGrocery Store\nElectricity Bill\n";
    },
    onPayeesImport: function() {
      // import the payees
      const importer = new PayeeImporter();
      var payees = importer.import(this.content);
      this.$store.dispatch(SET_PAYEES, payees);
    },
    /**
     * event = fileInput.changed event
     * dataField = name of the field on data object to which the content will be saved.
     */
    readFileContent: function(event, dataField) {
      // Receive a fileInput.changed event. Read the file content and
      // invoke the callback function, if any, passing the contents.
      // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload

      var files = event.target.files;
      var file = files[0];

      var reader = new FileReader();
      //reader.readAsDataURL(file) => useful when adding the source to images directly.
      var component = this;
      reader.onload = function(event) {
        // File was successfully read.
        // target = FileReader
        var content = event.target.result;
        //console.log(content)

        if (dataField) {
          component[dataField] = content;
        }
      };
      reader.readAsText(file);
    }
  }
};
</script>
<style>
textarea {
  width: 100%;
  height: 10em;
}
</style>
