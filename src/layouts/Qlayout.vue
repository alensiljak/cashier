<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="toolbarVisible" elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" icon="menu" @click="toggleDrawer" />

        <q-toolbar-title>{{ title }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <QSidebar ref="sidebar" />

    <q-page-container @menu-clicked="console.log('yo')">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import QSidebar from "../components/QSidebar";

export default {
  name: "LayoutDefault",

  components: {
    QSidebar
  },

  data() {
    return {
      // title: 'Cashier'
    };
  },

  computed: {
    title() {
      return this.$store.state.pageTitle;
    },
    toolbarVisible() {
      return this.$store.state.mainToolbarVisible;
    }
  },

  created() {

  },

  methods: {
    toggleDrawer() {
      // console.log(this.$refs.sidebar)
      this.$refs.sidebar.toggleDrawer();
    }
  }
};
</script>

<style lang="scss">
@import "../css/styles.scss";
</style>
