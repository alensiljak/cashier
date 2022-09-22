<template>
  <q-page padding class="text-colour2">
    <!-- flex flex-center -->

    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="menuClicked"
        />

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
        <q-icon name="add" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/mainStore'

const router = useRouter()
const mainStore = useMainStore()

function menuClicked() {
  mainStore.toggleDrawer()
}

/**
 * fab clicked. Use for the new transaction.
 */
function onFab() {
  // create new transaction
  mainStore.newTx()

  router.push({ name: 'tx' })
}
</script>
<script lang="ts">
import SyncCard from '../components/SyncCard.vue'
import FavouritesCard from '../components/FavouritesCard.vue'
import JournalCard from '../components/JournalCard.vue'
import ScheduledCard from '../components/ScheduledTxCard.vue'

export default {
  name: 'PageHome',

  components: {
    ScheduledCard,
    SyncCard,
    FavouritesCard,
    JournalCard,
  },

  data() {
    return {
      lorem: 'some text',
    }
  },

  methods: {
    onFavClick() {
      this.$router.push({ name: 'favourites' })
    },
    onJournalClick() {
      this.$router.push({ name: 'journal' })
    },
    onScheduledClick() {
      this.$router.push({ name: 'scheduledtransactions' })
    },
  },
}
</script>

<style lang="sass" scoped>
.my-card
  //width: 100%
  // margin: 0.5em
  margin-bottom: 0.75em
  // max-width: 450px 
</style>