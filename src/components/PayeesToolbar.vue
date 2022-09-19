<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn
        flat
        dense
        round
        aria-label="Menu"
        icon="menu"
        @click="$emit('menu-clicked')"
      />

      <q-toolbar-title>{{ title }}</q-toolbar-title>

      <q-space />

      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list style="min-width: 175px">
            <q-item>
              <q-item-section @click="goToCache">Cache</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <!-- filter toolbar -->
    <q-toolbar class="text-white flex flex-center">
      <!-- <q-toolbar-title> -->
      <q-input
        v-model="myFilter"
        autofocus
        rounded
        standout
        dense
        color="accent"
        style="width: 23rem"
        debounce="400"
      >
        <template #append>
          <font-awesome-icon v-if="myFilter === ''" icon="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="myFilter = ''"
          />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['filter', 'menu-clicked'])

const myFilter = computed({
  get() {
    return this.filter
  },
  set(value) {
    emit('filter', value)
  },
})
</script>
<script>
export default {
  props: {
    title: { type: String, default: '' },
    filter: { type: String, default: '' },
  },

  methods: {
    goToCache() {
      this.$router.push({ name: 'cache' })
    },
  },
}
</script>
