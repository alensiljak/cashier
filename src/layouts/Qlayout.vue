<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn flat dense round @click="toggleDrawer" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Cashier</q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <QSidebar ref="sidebar"/>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import QSidebar from "../components/QSidebar";

export default {
  name: "LayoutDefault",

  data() {
    return {
      // leftDrawerOpen: this.$q.platform.is.desktop
    };
  },
  methods: {
    toggleDrawer() {
      this.$refs.sidebar.toggleDrawer();
    }
  },
  components: {
    QSidebar
  }
};
</script>
