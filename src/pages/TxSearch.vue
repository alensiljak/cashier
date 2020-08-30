<template>
  <q-page padding class="bg-colour1 text-colour2">
    Transaction Search

    <div class="text-center q-my-lg">
      <q-btn color="secondary" text-color="accent" @click="search">
        <font-awesome-icon icon="search" transform="grow-6 right-6" class="q-mr-sm" />
        <span class="q-ml-sm">Search</span>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
    data() {
        return {

        }
    },

  created() {
    this.$store.commit(SET_TITLE, "Transaction Search");
    this.$store.commit(MAIN_TOOLBAR, true);

    //this.loadSettings();
  },

  methods: {
      search() {
          // run the search
          //const message = "Not implemented yet"
          //this.$q.notify({ message: message, color: "primary" }) // green
          //this.$q.notify({ message: message, color: "secondary" }) // red
      }
  }
}
</script>

<style>

</style>
