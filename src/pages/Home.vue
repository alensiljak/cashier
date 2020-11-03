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

        <q-toolbar-title>Cashier <span style="font-size: small;">({{ this.$version }})</span></q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- <img alt="Quasar logo" src="/icons/icon96.png"> -->

    <!-- Cards -->

    <q-card dark bordered class="my-card" @click="onFavClick">
      <q-card-section class="text-subtitle2">Favourites</q-card-section>
      <q-card-section><favourites-card /></q-card-section>
    </q-card>

    <!-- Device Journal -->
    <q-card dark bordered class="my-card" @click="onJournalClick">
      <q-card-section class="text-subtitle2">Device Journal</q-card-section>
      <q-card-section>journal card</q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat dark color="primary"
               text-color="accent"
               @click.stop="onNewTxClick"
        >
          New
        </q-btn>
      </q-card-actions>
    </q-card>

    <!-- dummy -->
    <q-card dark class="my-card bg-primary">
      <q-card-section>{{ lorem }}</q-card-section>
      <q-separator />
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>

    <!-- Scheduled Transactions -->
    <q-card dark bordered class="my-card" @click="onScheduledClick">
      <q-card-section class="text-subtitle2">Upcoming Transactions</q-card-section>
      <q-card-section>scheduled transactions</q-card-section>
    </q-card>

    <q-card dark bordered class="my-card">
      <q-card-section class="text-subtitle2">CashierSync</q-card-section>
      <q-card-section><sync-card /></q-card-section>
      <q-card-actions>actions</q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from '../mutations'
import SyncCard from '../components/SyncCard.vue'
import FavouritesCard from '../components/FavouritesCard'

export default {
  name: 'PageHome',

  components: {
    SyncCard,
    FavouritesCard,
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
    onNewTxClick() {
      this.$router.push({ name: 'tx' })
    },
    onScheduledClick() {
      this.$router.push({ name: 'scheduled' })
    }
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