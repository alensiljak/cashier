<template>
  <q-page padding class="text-colour2">
    <!-- toolbar -->
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

        <q-toolbar-title>Reorder Postings</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <accounts-list
      v-model:list="postings"
      lock-axis="y"
      axis="y"
      :value="postings"
      :model-value="postings"
      @input="onListChange"
    >
      <posting-item
        v-for="(posting, index) in postings"
        :key="posting"
        :index="index"
        :posting="posting"
        :value="posting"
      />
    </accounts-list>
  </q-page>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'
import AccountsList from '../components/SortableAccountsList.vue'
import PostingItem from '../components/SortablePostingItem.vue'
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const mainStore = useMainStore()
const { tx } = mainStore
const $q = useQuasar()
const $router = useRouter()

const postings = ref([])

onMounted(async () => {
  postings.value = tx.postings
})

function onListChange(list: any) {
  postings.value = list
}

function onSaveClicked() {
  save()
  $router.back()
}

function save() {
  // save the postings into the local store
  tx.postings = postings.value

  $q.notify({ message: 'Postings reordered', color: 'positive' })
}

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
