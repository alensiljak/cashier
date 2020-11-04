<template>
  <div>
    <div class="row">
      <!-- spacer -->
      <div class="col-1" />

      <div class="col">
        <!-- Account -->
        <q-input
          v-model="account"
          dark
          label="Account"
          @click="$emit('account-clicked')"
        />
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-2" />
      <div class="col-3 col-xs-5">
        <!-- Amount -->
        <q-input
          v-model.number="amount"
          dark
          label="Amount"
          type="number"
          input-class="text-right"
          @change="$emit('amount-changed')"
        />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <q-input v-model="currency" dark label="Currency" />
      </div>
    </div>
  </div>
</template>

<script>
import appService from '../appService'
import { SET_POSTING } from '../mutations'

export default {
  props: {
    // posting: { type: Object, default: null },
    index: { type: Number, default: null },
  },

  data: function () {
    return {
      accountOptions: null,
    };
  },

  computed: {
    account: {
      get() {
        return this.$store.state.transaction.postings[this.index].account
      },
      set(value) {
        let posting = this.$store.state.transaction.postings[this.index]
        posting.account = value
        this.$store.commit(SET_POSTING, { index: this.index, posting: posting })
      }
    },
    amount: {
      get() {
        return this.$store.state.transaction.postings[this.index].amount
      },
      set(value) {
        let posting = this.$store.state.transaction.postings[this.index]
        posting.amount = value
        this.$store.commit(SET_POSTING, { index: this.index, posting: posting })
      }
    },
    currency: {
      get() {
        return this.$store.state.transaction.postings[this.index].currency
      },
      set(value) {
        let posting = this.$store.state.transaction.postings[this.index]
        posting.currency = value
        this.$store.commit(SET_POSTING, { index: this.index, posting: posting })
      }
    },
  },

  created() {
    // console.log(this.accounts)
  },

  methods: {
  }
};
</script>
