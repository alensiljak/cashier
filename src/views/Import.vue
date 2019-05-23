<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>
      Import balance sheet by selecting a file or pasting into the text box below.
      Export from ledger using "ledger balance --flat".
    </p>
    <q-input class="text-red" dark clearable type="file" @input="onBalanceFile"/>
    <!-- v-on:dragover="onFileHover"
    v-on:change="onBalanceFile"-->

    <div class="q-mt-sm"/>

    <p>Click the appropriate button to import:</p>

    <div class="row">
      <div class="col text-center">
        <q-btn
          color="red-10"
          text-color="amber-4"
          label="Accounts"
          @click="onImportBalanceClick"
          icon="fas fa-wallet"
        />
      </div>
      <div class="col text-center">
        <q-btn disable color="red-10" text-color="amber-4" label="Payees" icon="fas fa-users"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import appService from "../appService";
import { Notify } from "quasar";

export default {
  data() {
    return {
      balanceSheetContent: null
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "Import");
    this.$store.commit(MAIN_TOOLBAR, true);
  },

  methods: {
    onImportBalanceClick() {
      //   console.log(this.balanceSheetContent);
      appService.importBalanceSheet(this.balanceSheetContent).then(() => {
        Notify.create({ color: "teal-9", message: "Accounts imported" });
      });
    },
    onBalanceFile(files) {
      this.readInputFile(files[0], "balanceSheetContent");
    },
    onFileHover(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
    },
    readInputFile(fileInfo, dataField) {
      //   console.log(fileInfo);
      var reader = new FileReader();

      reader.onload = event => {
        // File was successfully read.
        var content = event.target.result;

        if (dataField) {
          this[dataField] = content;
          //   console.log("read", content);
        }
      };

      reader.readAsText(fileInfo);
    }
  }
};
</script>
