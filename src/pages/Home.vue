<template>
  <q-page padding class="text-colour2">

    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" @click="menuClicked">
          <icon-menu />
        </q-btn>

        <q-toolbar-title>Cashier</q-toolbar-title>

        <q-btn flat round dense>
          <more-vertical />
          <q-menu>
            <q-list style="min-width: 175px">
              <q-item v-close-popup clickable>
                <q-item-section @click="onHomeSettingsClicked">Home Settings</q-item-section>
                <q-item-section side>
                  <icon-settings />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>
      </q-toolbar>
    </q-header>
    <!-- <img alt="Quasar logo" src="/icons/favicon-96x96.png"> -->

    <!-- Cards -->

    <!-- Scheduled Transactions -->
    <scheduled-card class="my-card" @click="onScheduledClick"
      v-if="visibleCards.length != 0 && visibleCards.indexOf(CardNames.ScheduledXactCard) != -1" />

    <!-- Device Journal -->
    <journal-card class="my-card" @click="onJournalClick"
      v-if="visibleCards.length != 0 && visibleCards.indexOf(CardNames.JournalCard) != -1" />

    <!-- Financial Forecast -->
    <financial-forecast class="my-card" />

    <!-- Favourites -->
    <favourites-card class="my-card" @click="onFavClick"
      v-if="visibleCards.length != 0 && visibleCards.indexOf(CardNames.FavouritesCard) != -1" />

    <!-- CashierSync -->
    <sync-card v-if="visibleCards.length != 0 && visibleCards.indexOf(CardNames.SyncCard) != -1" />

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
import FinancialForecast from '../components/ForecastCard.vue'
import JournalCard from '../components/JournalCard.vue'
import ScheduledCard from '../components/ScheduledTxCard.vue'
import { onMounted, Ref, ref } from 'vue'
import { CardNames, SettingKeys, settings } from '../lib/settings'
import useNotifications from 'src/lib/Notifier'
import { Menu as IconMenu, MoreVertical, Plus as PlusIcon, Settings as IconSettings, X as IconX } from 'lucide-vue-next'

const router = useRouter()
const mainStore = useMainStore()
const Notification = useNotifications()

const dataCreationDialogVisible = ref(false)
var visibleCards: Ref<Array<string>> = ref([])

onMounted(async () => {
  // Check if the db is empty and offer to create demo data.
  const isDbInitialized = await settings.get(SettingKeys.dbInitialized)
  if (isDbInitialized == null) {
    dataCreationDialogVisible.value = true
  }

  // show only selected cards.
  var visibleCardsSetting = await settings.get(SettingKeys.visibleCards)
  if (visibleCardsSetting == null) {
    visibleCards.value = Object.values(CardNames)
  } else {
    visibleCards.value = visibleCardsSetting
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

function onHomeSettingsClicked() {
  // open home settings screen
  router.push({ name: 'home.settings' })
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