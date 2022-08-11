<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'pCloud'" />

    <div>
      <!-- <q-input label="Remote location" dark v-model="url" /> -->

      <q-btn
        label="Fetch"
        color="secondary"
        text-color="accent"
        @click="login"
      />

      <q-btn
        label="Backup"
        color="secondary"
        text-color="accent"
        @click="backup"
      />

      <p>{{ output }}</p>
    </div>
  </q-page>
</template>

<script>
import RemoteStorage from "../lib/remoteStorage";
import Toolbar from "../components/CashierToolbar.vue";

export default {
  components: {
    Toolbar,
  },
  data() {
    return {
      // url: null,
      output: null,
    };
  },

  created() {},

  methods: {
    backup() {
      // get journal for export
      let output = "test";
      let client = new RemoteStorage();
      this.output = client.store(output);
    },
    login() {
      //   let url = "https://webdav.pcloud.com";
      //   this.loginWithRedirect();
      // this.loginWithoutRedirect();
      const client = new RemoteStorage();
      this.output = client.fetch();
    },
  },
};
</script>
