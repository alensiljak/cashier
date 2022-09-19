<template>
  <div>
    <div class="row">
      <div class="col">
        <!-- Account -->
        <q-input
          v-model="account"
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
          label="Amount"
          type="number"
          input-class="text-right"
          @change="$emit('amount-changed')"
          @focus="onAmountFocus"
        />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <q-input v-model="currency" label="Currency">
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
import { storeToRefs } from 'pinia'

const mainStore = useMainStore()
const { tx } = storeToRefs(mainStore)

const props = defineProps({
  index: { type: Number, default: null },
})
const { index } = toRefs(props)

// inject('tx')

let i = index.value

// emits

const emit = defineEmits(['account-clicked', 'amount-changed'])

// computed

const account = computed({
  get() {
    return tx.value.postings[i].account
  },
  set(val) {
    tx.value.postings[i].account = val
  },
})
const amount = computed({
  get() {
    return tx.value.postings[i].amount
  },
  set(val) {
    tx.value.postings[i].amount = val
  },
})
const currency = computed({
  get() {
    return tx.value.postings[i].currency
  },
  set(val) {
    tx.value.postings[i].currency = val
  },
})

// methods

/**
 * Select the amount when tapped in the field, for easier overwriting the value.
 * @param {Event} e
 */
function onAmountFocus(e) {
  e.target.select()
}
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
}
</script>
