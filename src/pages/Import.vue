<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Import'" />

    <ul>
      <li>
        For account balances, export the balance sheet with
        "ledger balance --flat --no-total".
      </li>
      <li>Export commodities with "ledger commodities"</li>
    </ul>
    <p>Import the text file</p>
    <q-input class="text-red" dark clearable type="file" @input="onFileSelected" />
    <!-- v-on:dragover="onFileHover"
    v-on:change="onFileSelected"-->
    <p class="q-mt-sm">or paste into the box below</p>
    <q-input v-model="content" type="textarea" dark outlined />

    <!-- <div class="q-mt-sm"/> -->
    <p class="q-mt-sm">Click the appropriate button to import:</p>

    <div class="row text-center q-mt-sm">
      <div class="col text-center">
        <q-btn :disable="clicked" color="red-10" text-color="accent"
               @click="onImportBalanceClick"
        >
          <font-awesome-icon icon="wallet" class="q-icon on-left" />
          <div>Accounts</div>
        </q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col text-center">
        <q-btn disable color="red-10" text-color="accent">
          <font-awesome-icon icon="users" class="q-icon on-left" />
          <div>Payees</div>
        </q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col text-center">
        <q-btn color="red-10" text-color="accent" :disable="clicked"
               @click="importCommoditiesClick"
        >
          <font-awesome-icon icon="boxes" class="q-icon on-left" />
          <div>Commodities</div>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import appService from "../appService";

export default {
  components: {
    Toolbar
  },
  data() {
    return {
      content: null,
      clicked: false // indicates if a button was pressed
    };
  },

  created() {
  },

  methods: {
    importCommoditiesClick() {
      this.clicked = true

      appService.importCommodities(this.content).then(() => {
        this.$router.push({ name: 'commodities' })
      })
    },
    onImportBalanceClick() {
      this.clicked = true

      appService.importBalanceSheet(this.content).then(() => {
        // this.$q.notify({ color: "teal-9", message: "Accounts imported" });
        this.$router.push({ name: 'accounts' })
      });
    },
    onFileSelected(files) {
      this.readInputFile(files[0], "content");
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
