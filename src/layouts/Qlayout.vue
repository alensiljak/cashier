<template>
  <q-layout view="lHh Lpr lFf">
    <toolbar />
    <QSidebar ref="sidebar" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import QSidebar from '../components/QSidebar.vue'
import Toolbar from '../components/CashierToolbar.vue'

export default {
  name: 'LayoutDefault',

  components: {
    QSidebar,
    Toolbar,
  },
}
</script>

<style lang="scss">
@import '../css/styles.scss';
</style>
