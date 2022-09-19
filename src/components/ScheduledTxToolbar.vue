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
        <q-menu auto-close>
          <q-list style="min-width: 175px" class="bg-colour1">
            <q-item clickable>
              <q-item-section @click="toggleSearch"> Find </q-item-section>
              <q-item-section side>
                <font-awesome-icon icon="search" transform="grow-9 left-5" />
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="$emit('restoreClicked')">
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
              <q-item-section @click="$emit('backupClicked')">
                Backup
              </q-item-section>
              <q-item-section side>
                <font-awesome-icon
                  icon="sign-out-alt"
                  transform="grow-9 left-5"
                />
              </q-item-section>
            </q-item>
            <!-- Calendar -->
            <q-item clickable>
              <q-item-section @click="$emit('calendarClicked')">
                Calendar
              </q-item-section>
              <q-item-section side>
                <font-awesome-icon
                  icon="calendar-alt"
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
        ref="searchInput"
        v-model="filter"
        autofocus
        rounded
        standout
        dense
        color="accent"
        style="width: 23rem"
        debounce="400"
        @update:model-value="$emit('filterChanged', filter)"
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

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store/mainStore'
// import { useQuasar } from 'quasar'

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
<!-- <script>
// import { QMenu } from 'quasar'

//const searchInput = (ref < QMenu) | (null > null) // the search text input control

export default {
  setup() {
    //const numEmployees = 10
    return { searchInput }
  },
}
</script> -->
