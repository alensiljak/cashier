<template>
  <q-layout view="lHh Lpr lFf">
    <toolbar />
    <QSidebar ref="sidebar" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import QSidebar from "../components/QSidebar";
import Toolbar from '../components/Toolbar'

export default {
  name: "LayoutDefault",

  components: {
    QSidebar,
    Toolbar
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
