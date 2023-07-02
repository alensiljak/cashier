<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'WebDAV'" />

    <div>
      <q-input v-model="url" label="Remote location" />

      <q-btn label="test" @click="testWebDav" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
/*
  WebDAV can't be used to access pCloud from the browser, due to CORS settings!
  Trying with RoundSync.
*/

import { createClient } from 'webdav';
import Toolbar from '../components/CashierToolbar.vue'
import { ref } from 'vue';
import useNotifications from 'src/lib/CashierNotification'

const Notification = useNotifications()

const url = ref('');

async function testWebDav() {
  await listDir();
}

function connectToPcloud() {
  // let url = 'https://webdav.pcloud.com'
  //   const client = createClient(url, {
  //     username: "user",
  //     password: "pass"
  //   });
  // //   this.listDir();
  //     client.getDirectoryContents("/").then(response => {
  //         console.log(response)
  //     })

}

async function listDir() {
  let client = createClient(url.value);
  const directoryItems = await client.getDirectoryContents('/');

  // console.log(directoryItems);

  Notification.info(directoryItems)
}

</script>
