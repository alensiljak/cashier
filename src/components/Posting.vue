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
import { computed, toRefs } from 'vue'
import { useMainStore } from '../store/mainStore'

const mainStore = useMainStore()
const { tx } = mainStore

const props = defineProps({
  index: { type: Number, default: null },
})
const { index } = toRefs(props)

// inject('tx')

let i = index.value

const account = computed({
  get() {
    return tx.postings[i].account
  },
  set(val) {
    tx.postings[i].account = val
  },
})
const amount = computed({
  get() {
    return tx.postings[i].amount
  },
  set(val) {
    tx.postings[i].amount = val
  },
})
const currency = computed({
  get() {
    return tx.postings[i].currency
  },
  set(val) {
    tx.postings[i].currency = val
  },
})
</script>
<script>
export default {
  data: function () {
    return {
      accountOptions: null,
    }
  },

  computed: {
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
