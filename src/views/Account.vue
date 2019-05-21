<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Account</q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <q-icon name="sync"/>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Import</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <p>Editor for the Account: {{ accountName }}</p>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER, MAIN_TOOLBAR } from "../mutations";

export default {
  data() {
    return {
        accountName: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    // this.loadData();
    this.accountName = this.$route.params.id
  },

  methods: {
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    }
  }
};
</script>
