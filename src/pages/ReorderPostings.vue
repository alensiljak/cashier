<template>
  <q-page padding class="text-colour2">
    <!-- toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" @click="toggleDrawer">
          <icon-menu />
        </q-btn>

        <q-toolbar-title>Reorder Postings</q-toolbar-title>
        <q-space />

        <q-btn flat round dense @click="onSaveClicked">
          <icon-check />
        </q-btn>
      </q-toolbar>
    </q-header>

    <draggable tag="q-list" :list="postings" class="list-group" handle=".handle" item-key="name">
      <template #item="{ element }">
        <q-item v-ripple clickable class="list-item">
          <q-item-section>{{ element.account }}</q-item-section>
          <q-item-section side>
            {{ element.amount }} {{ element.currency }}
          </q-item-section>
          <q-item-section side class="handle">
            <icon-menu left />
          </q-item-section>
        </q-item>
      </template>
    </draggable>

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <icon-check />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'
import { onMounted, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Posting, Transaction } from 'src/model'
import useNotifications from 'src/lib/CashierNotification'
import draggable from 'vuedraggable'
import { Check as IconCheck, Menu as IconMenu } from 'lucide-vue-next'

const mainStore = useMainStore()
const { tx } = storeToRefs(mainStore)
const $q = useQuasar()
const $router = useRouter()
const Notification = useNotifications()

const postings: Ref<Posting[]> = ref([])

onMounted(async () => {
  postings.value = tx.value.postings
})

function onFabClicked() {
  onSaveClicked()
}

function onSaveClicked() {
  save()
  $router.back()
}

function save() {
  // save the postings into the local store
  tx.value.postings = postings.value

  Notification.positive('Postings reordered')
}

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
