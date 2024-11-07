<template>
  <q-layout view="lHh Lpr lFf">
    <toolbar />
    <QSidebar ref="sidebar" />

    <q-page-container>
      <div v-touch-swipe.mouse.right="onSwipe">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useMainStore } from '../store/mainStore'
import QSidebar from '../components/QSidebar.vue'
import Toolbar from '../components/CashierToolbar.vue'

const mainStore = useMainStore()

export default {
  name: 'LayoutDefault',

  components: {
    QSidebar,
    Toolbar,
  },

  methods: {
    onSwipe(evt: any): void {
      // console.log('open drawer', evt.direction, evt.duration, evt.distance)
      // apply min. swipe distance before toggling the drawer.
      if (evt.distance > 30) {
        mainStore.toggleDrawer()
      }

    }
  }
}
</script>

<style lang="scss">
@import '../css/styles.scss';
</style>
