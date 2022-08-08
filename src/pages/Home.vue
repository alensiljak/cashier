<template>
  <q-page padding class="bg-colour1 text-colour2">
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

        <q-toolbar-title>
          Cashier
          <span style="font-size: small">({{ $version }})</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- <img alt="Quasar logo" src="/icons/icon96.png"> -->

    <!-- Cards -->

    <!-- Favourites -->
    <favourites-card class="q-mb-md" @click="onFavClick" />

    <!-- Device Journal -->
    <journal-card class="my-card" @click="onJournalClick" />

    <!-- dummy -->
    <!-- <q-card dark class="my-card bg-primary">
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
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER } from '../mutations'
import SyncCard from '../components/SyncCard.vue'
import FavouritesCard from '../components/FavouritesCard'
import JournalCard from '../components/JournalCard'
import ScheduledCard from '../components/ScheduledTxCard'
import { createApp } from 'vue'
import App from '../App.vue'

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

  computed: {
    version: {
      get() {
        const app = createApp(App)
        return app.config.globalProperties.$version
      },
    },
  },

  methods: {
    menuClicked() {
      let visible = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
    onFab() {
      // fab clicked. Use for the new transaction
      this.$router.push({ name: 'tx' })
    },
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