<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'WebDAV'" />

    <div>
      <q-input v-model="url" label="Remote location" />

      <q-btn label="test" @click="testWebDav" />
    </div>
  </q-page>
</template>

<script lang="ts">
/*
  WebDAV can't be used for pCloud from the browser, due to CORS settings!
  ***********************************************************************
*/

// const { createClient } = require("webdav");
// import { createClient } from "webdav";
import Toolbar from '../components/CashierToolbar.vue'

export default {
  components: {
    Toolbar,
  },
  data() {
    return {
      url: null,
    }
  },

  created() {},

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
    },
  },
}
</script>
