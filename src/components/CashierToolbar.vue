<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn flat dense round aria-label="Menu" @click="toggleDrawer">
        <menu-icon />
      </q-btn>

      <q-toolbar-title>{{ title }}</q-toolbar-title>

      <q-space />

      <slot></slot>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'
import { Menu as MenuIcon } from 'lucide-vue-next'

const mainStore = useMainStore()

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
<script lang="ts">
export default {
  props: { title: { type: String, default: 'Cashier' } },
}
</script>