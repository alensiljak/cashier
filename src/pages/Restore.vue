<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Restore Backup" />

    <p>You can currently restore the backup of Scheduled Transactions</p>
    <p>
      Note that this will overwrite all your current records of the same type!
    </p>

    <q-file
      v-model="file"
      dark
      clearable
      label="Select backup file"
      @input="onFileSelected"
    />

    <q-input v-model="fileContent" dark type="textarea" />

    <div class="text-center q-pt-lg">
      <q-btn color="accent" text-color="secondary" @click="onRestoreClicked">
        Restore
      </q-btn>
    </div>
  </q-page>
</template>
<script>
import Toolbar from "../components/CashierToolbar.vue";
import appService from "../appService";

export default {
  components: {
    Toolbar,
  },
  props: {
    type: {
      type: String,
      default: "scheduled",
    },
  },
  data() {
    return {
      file: null,
      fileContent: null,
    };
  },
  methods: {
    onFileSelected() {
      // read file
      appService.readFile(this.file, this.onFileRead);
    },
    onFileRead(content) {
      this.fileContent = content;
    },
    async onRestoreClicked() {
      // restore data from the file
      if (!this.fileContent) {
        this.$q.notify({
          message: "You need to select a file",
          color: "negative",
        });
        return;
      }

      //console.log(this.fileContent)
      await appService.importScheduledTransactions(this.fileContent);
      this.$q.notify({
        message: "Restore complete",
        color: "positive",
      });
    },
  },
};
</script>