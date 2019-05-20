<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Accounts</q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dense dark style="min-width: 175px" class="bg-colour1">
              <q-item clickable v-close-popup>
                <q-item-section>Yo</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>option 2</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>Accounts
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER, MAIN_TOOLBAR } from "../mutations";

export default {
  created() {
    this.$store.commit(MAIN_TOOLBAR, false);
  },

  methods: {
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    }
  }
};
</script>
