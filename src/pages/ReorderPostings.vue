<template>
  <q-page padding class="bg-colour1 text-colour2">
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
      :modelValue="postings"
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

<script setup>
import { useMainStore } from '../store/mainStore'

const mainStore = useMainStore()
const { tx } = mainStore

//this.postings = tx.postings

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>
<script>
import AccountsList from '../components/SortableAccountsList.vue'
import PostingItem from '../components/SortablePostingItem.vue'

export default {
  components: {
    AccountsList,
    PostingItem,
  },

  data() {
    return {
      postings: [],
    }
  },

  created() {
    // this.load()
    this.postings = this.tx.postings
  },

  methods: {
    onListChange(list) {
      this.postings = list
    },
    onSaveClicked() {
      this.save()
      this.$router.back()
    },
    save() {
      // save the postings into the local store
      this.tx.postings = this.postings

      this.$q.notify({ message: 'Postings reordered', color: 'positive' })
    },
  },
}
</script>