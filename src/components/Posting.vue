<template>
  <div>
    <div class="row">
      <div class="col">
        <!-- Account -->
        <q-input
          v-model="posting.account"
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
          v-model.number="posting.amount"
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
        <q-input v-model="posting.currency" dark label="Currency">
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
import { useMainStore } from '../store/mainStore'

const mainStore = useMainStore()
const { tx } = mainStore
</script>
<script>
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
    posting: {
      get() {
        if (!this.tx) return

        return this.tx.postings[this.index]
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
