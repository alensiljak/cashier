<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Commodities</p>
  </q-page>
</template>

<script>
import { SET_TITLE, MAIN_TOOLBAR } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "Commodities");
    this.$store.commit(MAIN_TOOLBAR, true);
  }
};
</script>
