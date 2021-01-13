<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Reorder Postings" />

    <accounts-list v-model="postings" lock-axis="y">
      <posting-item
        v-for="(posting, index) in postings"
        :key="index"
        :index="index"
        :posting="posting"
      />
    </accounts-list>

    <div class="text-center q-mt-xl">
      <q-btn color="accent" text-color="secondary" class="col" @click="save">
        <font-awesome-icon
          icon="save"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        <div>Save</div>
      </q-btn>
    </div>
  </q-page>
</template>
<script>
import Toolbar from '../components/Toolbar'
import AccountsList from '../components/SortableAccountsList'
import PostingItem from '../components/SortablePostingItem'
import { CurrentTransactionService } from '../lib/currentTransactionService'

export default {
  components: {
    AccountsList,
    PostingItem,
    Toolbar
  },

  data() {
    return {
      postings: []
    }
  },

  created() {
    this.load()
  },

  methods: {
    load() {
      // load the postings
      const svc = new CurrentTransactionService(this.$store)
      let tx = svc.getTx()
      if (!tx) {
        tx = svc.createTransaction()
      }
      this.postings = tx.postings
    },
    save() {
      // save the postings into the local store
      const svc = new CurrentTransactionService(this.$store)
      let tx = svc.getTx()
      if (!tx) {
          tx = svc.createTransaction()
      }
      tx.postings = this.postings

      this.$q.notify({ message: 'data saved', color: 'positive'})
    }
  }
}
</script>