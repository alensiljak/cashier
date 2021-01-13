<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn
        flat
        dense
        round
        aria-label="Menu"
        icon="menu"
        @click="toggleDrawer"
      />

      <q-toolbar-title>{{ title }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
<script>
export default {
  props: { title: { type: String, default: 'Cashier' } },

  methods: {
    toggleDrawer() {
        this.$root.$emit('toggle_drawer')
    },
  },
}
</script>