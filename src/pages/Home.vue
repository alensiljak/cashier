<template>
  <q-page padding class="text-colour2">
    <!-- flex flex-center -->

    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" @click="menuClicked">
          <icon-menu />
        </q-btn>

        <q-toolbar-title> Cashier </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- <img alt="Quasar logo" src="/icons/favicon-96x96.png"> -->

    <!-- Cards -->

    <!-- Favourites -->
    <favourites-card class="q-mb-md" @click="onFavClick" />

    <!-- Device Journal -->
    <journal-card class="my-card" @click="onJournalClick" />

    <!-- dummy -->
    <!-- <q-card  class="my-card bg-primary">
      <q-card-section>{{ lorem }}</q-card-section>
      <q-separator />
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card> -->

    <!-- Scheduled Transactions -->
    <scheduled-card class="my-card" @click="onScheduledClick" />

    <!-- CashierSync -->
    <sync-card />

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFab">
        <plus-icon />
      </q-btn>
    </q-page-sticky>
  </q-page>

  <!-- Prompt to create demo data -->
  <q-dialog v-model="dataCreationDialogVisible" persistent content-class="bg-blue-grey-10">
    <q-card class="bg-primary text-amber-2">
      <q-bar>
        <div>Database empty</div>

        <q-space />

        <q-btn dense flat v-close-popup>
          <icon-x />
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="row items-center">
        <span>Your database is empty. <br />
          Do you want to create some demo data to try the app?</span>
      </q-card-section>
      <q-card-section>
        <p>You can always create demo data from the Settings page.</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="No" color="accent" @click="onCreateDataDenied" />
        <q-btn v-close-popup flat label="Yes" color="accent" @click="onCreateDataConfirmed" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/mainStore'
import SyncCard from '../components/SyncCard.vue'
import FavouritesCard from '../components/FavouritesCard.vue'
import JournalCard from '../components/JournalCard.vue'
import ScheduledCard from '../components/ScheduledTxCard.vue'
import { onMounted, ref } from 'vue'
import { SettingKeys, settings } from '../lib/settings'
import useNotifications from 'src/lib/CashierNotification'
import { Menu as IconMenu, Plus as PlusIcon, X as IconX } from 'lucide-vue-next'

const router = useRouter()
const mainStore = useMainStore()
const Notification = useNotifications()

const dataCreationDialogVisible = ref(false)

onMounted(async () => {
  // Check if the db is empty and offer to create demo data.
  const isDbInitialized = await settings.get(SettingKeys.dbInitialized)
  if (isDbInitialized == null) {
    dataCreationDialogVisible.value = true
  }
})

function menuClicked() {
  mainStore.toggleDrawer()
}

function onCreateDataConfirmed() {
  // go to create demo data page.
  router.push({ name: 'demoData' })
}

function onCreateDataDenied() {
  settings.set(SettingKeys.dbInitialized, false)
}

/**
 * fab clicked. Use for the new transaction.
 */
function onFab() {
  // create new transaction
  mainStore.newTx()

  router.push({ name: 'tx' })
}

function onFavClick() {
  router.push({ name: 'favourites' })
}

function onJournalClick() {
  router.push({ name: 'journal' })
}

function onScheduledClick() {
  router.push({ name: 'scheduledtransactions' })
}

</script>

<style lang="sass" scoped>
.my-card
  //width: 100%
  // margin: 0.5em
  margin-bottom: 0.75em
  // max-width: 450px 
</style>