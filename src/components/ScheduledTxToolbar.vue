<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn
        flat
        dense
        round
        aria-label="Menu"
        icon="menu"
        @click="onMenuClicked"
      />

      <q-toolbar-title>{{ title }}</q-toolbar-title>

      <q-space />

      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list dark style="min-width: 175px" class="bg-colour1">
            <q-item>
              <q-item-section @click="$emit('export-clicked')">
                Export
              </q-item-section>
              <q-item-section side>
                <font-awesome-icon
                  icon="sign-out-alt"
                  transform="grow-9 left-5"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
<script>
import { TOGGLE_DRAWER } from '../mutations'

export default {
  props: {
    title: { type: String, default: '' },
  },

  methods: {
    onMenuClicked() {
      let visible = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
  },
}
</script>