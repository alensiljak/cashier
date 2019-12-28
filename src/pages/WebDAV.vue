<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>
      <q-input label="Remote location" dark v-model="url" />

      <q-btn label="test" @click="testWebDav" />
    </div>
  </q-page>
</template>

<script>
/*
  WebDAV can't be used for pCloud from the browser, due to CORS settings!
  ***********************************************************************
*/

import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
// const { createClient } = require("webdav");
// import { createClient } from "webdav";

export default {
  data() {
    return {
      url: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "WebDAV");
  },

  methods: {
    testWebDav() {
      // let url = 'https://webdav.pcloud.com'
      //   const client = createClient(url, {
      //     username: "user",
      //     password: "pass"
      //   });
      // //   this.listDir();
      //     client.getDirectoryContents("/").then(response => {
      //         console.log(response)
      //     })
    },
    async listDir() {
      // const directoryItems = await client.getDirectoryContents("/");
      // console.log(directoryItems)
    }
  }
};
</script>
