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

        <q-toolbar-title>Cashier</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- <img alt="Quasar logo" src="/icons/icon96.png"> -->

    <!-- Cards -->

    <q-card dark bordered class="my-card">
      <q-card-section>Favourites</q-card-section>
    </q-card>

    <q-card dark bordered class="my-card">
      <q-card-section>Journal</q-card-section>
    </q-card>

    <q-card dark class="my-card bg-primary">
      <q-card-section>{{ lorem }}</q-card-section>
      <q-separator />
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>

    <q-card dark bordered class="my-card">
      <q-card-section><sync-card /></q-card-section>
      <q-card-actions>actions</q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from '../mutations'
import SyncCard from '../components/Sync'

export default {
  name: 'PageHome',

  components: {
    SyncCard
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
  }
}
</script>

<style lang="sass" scoped>
.my-card
  //width: 100%
  // margin: 0.5em
  margin-bottom: 0.75em
  // max-width: 450px 
</style>