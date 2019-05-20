<template>
  <q-page padding class="bg-colour1 text-colour2">
        <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu" />

        <q-toolbar-title>Accounts</q-toolbar-title>

      </q-toolbar>
    </q-header>

    Accounts
    <q-btn flat round dense icon="more_vert"/>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER } from "../mutations";

export default {
  created() {
    // this.$store.commit(SET_TITLE, "Accounts");
  },

  methods: {
    menuClicked() {
      let visible = this.$store.state.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    }
  }
};
</script>
