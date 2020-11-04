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
};
</script>

<style lang="scss">
@import "../css/styles.scss";
</style>
