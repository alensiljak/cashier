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
<script>
import AccountsList from '../components/SortableAccountsList.vue'
import PostingItem from '../components/SortablePostingItem.vue'
import eventBus from '../lib/eventBus'
import { toRaw } from 'vue'
import { CurrentTransactionService } from '../lib/currentTransactionService'
import { Posting } from '../model'

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

  computed: {
    tx: {
      get() {
        let tx = this.$store.state.transaction

        if (!tx) {
          const svc = new CurrentTransactionService(this.$store)
          tx = svc.createTransaction()
        }

        return tx
      },
    },
  },

  created() {
    this.load()
  },

  methods: {
    load() {
      // retrieve the postings
      let tx = this.$store.state.transaction
      if (!tx) return

      const postings = []
      for (var i in tx.postings) {
        const txposting = tx.postings[i]
        let posting = new Posting()
        posting.account = txposting.account
        posting.amount = txposting.amount
        posting.currency = txposting.currency

        postings.push(posting)
      }
      this.postings = postings
    },
    onListChange(list) {
      //console.log('input', list)
      this.postings = list
    },
    onSaveClicked() {
      this.save()
      this.$router.back()
    },
    save() {
      // save the postings into the local store
      //this.tx.postings = this.postings
      this.$store.commit('setPostings', toRaw(this.postings))

      this.$q.notify({ message: 'Postings reordered', color: 'positive' })
    },
    toggleDrawer() {
      eventBus.$emit('toggle-drawer')
    },
  },
}
</script>