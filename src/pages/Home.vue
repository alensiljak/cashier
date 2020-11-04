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
          <span style="font-size: small">({{ this.$version }})</span>
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
    <q-card dark bordered class="my-card" @click="onScheduledClick">
      <q-card-section class="text-subtitle2">
        Upcoming Transactions
      </q-card-section>
      <q-card-section>scheduled transactions</q-card-section>
    </q-card>

    <!-- CashierSync -->
    <sync-card />
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import { TOGGLE_DRAWER } from '../mutations'
import SyncCard from '../components/SyncCard.vue'
import FavouritesCard from '../components/FavouritesCard'
import JournalCard from '../components/JournalCard'

export default {
  name: 'PageHome',

  components: {
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
    menuClicked() {
      let visible = this.$store.state.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
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