<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn flat dense round aria-label="Menu" @click="$emit('menu-clicked')">
        <icon-menu />
      </q-btn>

      <q-toolbar-title>{{ title }}</q-toolbar-title>

      <q-space />

      <!-- <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list style="min-width: 175px">
            <q-item>
              <q-item-section @click="goToCache">Cache</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn> -->
    </q-toolbar>

    <!-- filter toolbar -->
    <q-toolbar class="text-white flex flex-center">
      <!-- <q-toolbar-title> -->
      <q-input v-model="myFilter" autofocus rounded standout dense color="accent" style="width: 23rem" debounce="400">
        <template #append>
          <icon-search v-if="myFilter === ''" />
          <x-circle v-else class="cursor-pointer" @click="myFilter = ''" />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search as IconSearch } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { Menu as IconMenu, XCircle } from 'lucide-vue-next'

const $router = useRouter()

const emit = defineEmits(['filter', 'menu-clicked'])

const props = defineProps({
  title: { type: String, default: '' },
  filter: { type: String, default: '' },
})

const myFilter = computed({
  get() {
    return props.filter
  },
  set(value) {
    emit('filter', value)
  },
})

function goToCache() {
  $router.push({ name: 'cache' })
}

</script>
