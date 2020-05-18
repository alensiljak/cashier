<template>
      <q-page padding class="bg-colour1 text-colour2">

      </q-page>
</template>

<script>
import { TOGGLE_DRAWER, MAIN_TOOLBAR } from "../mutations";

export default {
  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    this.loadAccount(this.$route.params.id);
  },
}
</script>