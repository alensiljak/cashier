<template>
  <q-page padding class="bg-colour1 text-colour2">
      <p>Import balance sheet by selecting a file or pasting into the text box below:</p>
      <q-input type="file" />
      <q-btn color="red-10" text-color="amber-4" label="Import" />
    </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "Import");
    this.$store.commit(MAIN_TOOLBAR, true);
  }
};
</script>
