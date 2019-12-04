<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>
      <!-- <q-input label="Remote location" dark v-model="url" /> -->

      <q-btn label="Fetch" color="red-10" text-color="amber-4" @click="login" />

      <q-btn label="Backup" color="red-10" text-color="amber-4" @click="backup" />

      <p>{{output}}</p>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import RemoteStorage from "../lib/remoteStorage"

export default {
  data() {
    return {
      // url: null,
      output: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "pCloud");
  },

  methods: {
    backup() {
      // get journal for export
      let output = "test"
      let client = new RemoteStorage()
      this.output = client.store(output)
    },
    login() {
      //   let url = "https://webdav.pcloud.com";
    //   this.loginWithRedirect();
        //this.loginWithoutRedirect();
      let client = new RemoteStorage()
      this.output = client.fetch()
    },

  }
};
</script>