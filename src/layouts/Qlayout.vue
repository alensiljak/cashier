<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy" v-if="toolbarVisible">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="toggleDrawer" aria-label="Menu" icon="menu" />

        <q-toolbar-title>{{ title }}</q-toolbar-title>

      </q-toolbar>
    </q-header>

    <QSidebar ref="sidebar"/>

    <q-page-container v-on:menu-clicked="console.log('yo')">
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
      // title: 'Cashier'
    };
  },

  methods: {
    toggleDrawer() {
      this.$refs.sidebar.toggleDrawer();
    }
  },
  
  computed: {
    title() {
      return this.$store.state.pageTitle
    },
    toolbarVisible() {
      return this.$store.state.mainToolbarVisible
    }
  },

  components: {
    QSidebar
  }
};
</script>

<style lang="scss">
@import '../styles/styles.scss'
</style>
