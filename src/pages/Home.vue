<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- flex flex-center -->

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

    <q-card dark class="my-card bg-primary q-mb-md">
      <q-card-section>{{ lorem }}</q-card-section>
      <q-separator />
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>

    <q-card dark bordered class="my-card q-mb-md">
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from '../mutations'

export default {
  name: 'PageHome',
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
  },
}
</script>

<style lang="sass" scoped>
.my-card
  //width: 100%
  // margin: 0.5em
  // max-width: 450px 
</style>