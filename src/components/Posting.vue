<template>
  <div>
    <div class="row">
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
      <div class="col-3 col-xs-5">
        <!-- Amount -->
        <q-input
          v-model.number="amount"
          dark
          label="Amount"
          type="number"
          input-class="text-right"
          @change="$emit('amount-changed')"
          @focus="onAmountFocus"
        />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <q-input v-model="currency" dark label="Currency">
          <template #append>
            <!-- warn if there's no currency but we have an amount -->
            <font-awesome-icon
              v-if="isMissingCurrency"
              icon="exclamation-circle"
              style="color: #92140c"
            />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTxStore } from '../store/txStore'

const txStore = useTxStore()
const { tx } = txStore
</script>
<script>
import { SET_POSTING } from '../mutations'

export default {
  props: {
    index: { type: Number, default: null },
  },

  data: function () {
    return {
      accountOptions: null,
    }
  },

  computed: {
    account: {
      get() {
        return this.tx.postings[this.index].account
      },
      set(value) {
        let posting = this.tx.postings[this.index]
        posting.account = value
      },
    },
    amount: {
      get() {
        return this.tx.postings[this.index].amount
      },
      set(value) {
        let posting = this.tx.postings[this.index]
        posting.amount = value
      },
    },
    currency: {
      get() {
        return this.tx.postings[this.index].currency
      },
      set(value) {
        let posting = this.tx.postings[this.index]
        posting.currency = value
      },
    },
    isMissingCurrency: {
      get() {
        const hasValidAmount = !isNaN(this.amount)
        const amountMissing = this.amount === ''
        const hasNoCurrency = this.currency === ''

        if (amountMissing) return false

        return hasNoCurrency && hasValidAmount
      },
    },
  },

  methods: {
    onAmountFocus(e) {
      e.target.select()
    },
  },
}
</script>
