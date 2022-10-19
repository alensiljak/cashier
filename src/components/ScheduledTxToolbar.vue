<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn flat dense round aria-label="Menu" icon="menu" @click="onMenuClicked" />

      <q-toolbar-title>{{ title }}</q-toolbar-title>

      <q-space />

      <q-btn flat round dense icon="more_vert">
        <q-menu auto-close>
          <q-list style="min-width: 175px">
            <q-item clickable>
              <q-item-section @click="toggleSearch"> Find </q-item-section>
              <q-item-section side>
                <icon-search />
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="$emit('restoreClicked')">
                Restore
              </q-item-section>
              <q-item-section side>
                <archive-restore />
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="$emit('backupClicked')">
                Backup
              </q-item-section>
              <q-item-section side>
                <file-down />
              </q-item-section>
            </q-item>
            <!-- Calendar -->
            <q-item clickable>
              <q-item-section @click="$emit('calendarClicked')">
                Calendar
              </q-item-section>
              <q-item-section side>
                <icon-calendar />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <!-- search -->
    <q-toolbar v-if="searchVisible" class="text-white flex flex-center">
      <q-input ref="searchInput" v-model="filter" autofocus rounded standout dense color="accent" style="width: 23rem"
        debounce="400" @update:model-value="$emit('filterChanged', filter)">
        <template #append>
          <icon-search v-if="!filter" />
          <x-circle v-else name="clear" @click="onResetFilterClicked" />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '../store/mainStore'
// import { useQuasar } from 'quasar'
import {
  ArchiveRestore, CalendarDays as IconCalendar, FileDown, Search as IconSearch,
  XCircle
} from 'lucide-vue-next'

const mainStore = useMainStore()
// const $q = useQuasar()

const emit = defineEmits([
  'backupClicked',
  'calendarClicked',
  'filterChanged',
  'restoreClicked',
])

// props

const props = defineProps({
  title: { type: String, default: '' },
})

// data

const filter = ref('')
const searchVisible = ref(true)
const searchInput = ref(null)

// methods

function onMenuClicked() {
  mainStore.toggleDrawer()
}

function onResetFilterClicked() {
  filter.value = null
  //this.$emit('filterChanged', this.filter)
  emit('filterChanged', filter.value)
}

function toggleSearch() {
  searchVisible.value = !searchVisible.value

  if (searchVisible.value) {
    // focus on the search input
    console.debug(searchInput.value)
    searchInput.value?.focus()
    //$q.refs
  }
}
</script>
