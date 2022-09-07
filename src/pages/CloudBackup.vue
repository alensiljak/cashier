<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar :title="'Cloud Backup'" />

    <div>
      <pre>
        Work in progress!!!

      Backup to and restore from the cloud storage. Only pCloud for now.

      Datasets:
      - favourite accounts
      - configuration settings (cashier server url, default currency, investment root account)
      - transactions
      - scheduled transactions

      Display the datasets with the last backup timestamp.
      The datasets can be backed up and restored at a push of a button.
    </pre
      >
    </div>

    <div>
      <div>Favourites</div>
      <div>Last backup:</div>

      <q-btn color="accent" text-color="secondary" @click="onFavUp"
        >Backup</q-btn
      >
      <q-btn color="accent" text-color="secondary" @click="onFavDn"
        >Restore</q-btn
      >
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import Toolbar from '../components/CashierToolbar.vue'
// import CloudBackup from '../lib/CloudBackup'
// import pcloudSdk from 'pcloud-sdk-js'
import Notification from '../lib/CashierNotification'
// import { negative, positive, neutral } from '../lib/CashierNotification.vue'
import useNotifications from '../lib/CashierNotification'
import useCloudBackup from '../lib/CloudBackup'

// var cloudBackup = new CloudBackup()
const { yo, state, cb } = useCloudBackup()
const { positive, neutral, negative } = useNotifications()

// data

// methods
onMounted(async () => {
  console.debug("and we're on!")

  cb.talk()
  neutral()
})

/**
 * Backup Favourites.
 */
async function onFavUp() {
  //await cloudBackup.backupFavourites()

  positive('yo')
}

async function onFavDn() {
  negative('meh')
}
</script>