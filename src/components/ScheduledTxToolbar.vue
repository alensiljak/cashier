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
            <q-item clickable>
              <q-item-section @click="searchVisible = true">
                Find
              </q-item-section>
              <q-item-section side>
                <font-awesome-icon icon="search" transform="grow-9 left-5" />
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="$emit('restore-clicked')">
                Restore
              </q-item-section>
              <q-item-section side>
                <font-awesome-icon
                  icon="sign-in-alt"
                  transform="grow-9 left-5"
                />
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="$emit('backup-clicked')">
                Backup
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

    <!-- search -->
    <q-toolbar v-if="searchVisible" class="text-white flex flex-center">
      <q-input
        v-model="filter"
        autofocus
        rounded
        standout
        dense
        dark
        color="accent"
        style="width: 23rem"
        debounce="400"
        @input="$emit('filter-changed', filter)"
      >
        <template #append>
          <font-awesome-icon v-if="filter === ''" icon="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="onResetFilterClicked"
          />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>
<script>
import { TOGGLE_DRAWER } from '../mutations'

export default {
  props: {
    title: { type: String, default: '' },
  },
  data() {
    return {
      searchVisible: false,
      filter: null
    }
  },
  methods: {
    onMenuClicked() {
      let visible = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
    onResetFilterClicked() {
      this.filter = null
      this.$emit('filter-changed', this.filter)
    }
  },
}
</script>