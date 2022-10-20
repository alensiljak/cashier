<template>
  <div>
    <div class="row">
      <div class="col">
        <!-- Account -->
        <q-input v-model="account" label="Account" @click="$emit('account-clicked')" />
      </div>
    </div>

    <div class="row justify-end">
      <div class="col flex valign-middle">
        <q-btn color="" text-color="negative" @click="$emit('delete-posting')">
          <icon-trash size="22" />
        </q-btn>
      </div>
      <div class="col-3 col-xs-5">
        <!-- Amount -->
        <q-input v-model.number="amount" label="Amount" type="number" input-class="text-right"
          @change="$emit('amount-changed')" @keyup="$emit('amount-changed')" @focus="onAmountFocus" />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <q-input v-model="currency" label="Currency" @keyup="$emit('currency-changed')"
          @change="$emit('currency-changed')">
          <template #append>
            <!-- warn if there's no currency but we have an amount -->
            <alert-octagon v-if="isMissingCurrency" class="icon" color="darkred" />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, WritableComputedRef } from 'vue'
import { useMainStore } from '../store/mainStore'
import { storeToRefs } from 'pinia'
import { AlertOctagon, AlertTriangle, Trash as IconTrash } from 'lucide-vue-next'

const mainStore = useMainStore()
const { tx } = storeToRefs(mainStore)

const props = defineProps({
  index: { type: Number, default: null },
})
const { index } = toRefs(props)

let i = index.value

// emits

const emit = defineEmits([
  'account-clicked',
  'amount-changed',
  'currency-changed',
  'delete-posting'
])

// computed

const account = computed({
  get() {
    if (!tx.value) {
      throw new Error('Transaction does not exist!')
    }

    return tx.value.postings[i].account
  },
  set(val) {
    if (!tx.value) {
      throw new Error('Transaction does not exist!')
    }

    tx.value.postings[i].account = val
  },
})
const amount = computed({
  get() {
    if (!tx.value) {
      throw new Error('Transaction does not exist!')
    }

    return tx.value.postings[i].amount
  },
  set(val) {
    if (!tx.value) {
      throw new Error('Transaction does not exist!')
    }

    tx.value.postings[i].amount = val
  },
})
const currency: WritableComputedRef<string> = computed({
  get() {
    if (!tx.value) {
      throw new Error('Transaction does not exist!')
    }

    return tx.value.postings[i].currency
  },
  set(val: string) {
    if (!tx.value) {
      throw new Error('Transaction does not exist!')
    }

    tx.value.postings[i].currency = val
  },
})

const isMissingCurrency = computed({
  get() {
    const hasValidAmount = !isNaN(amount.value)
    const amountMissing = amount.value === ''
    const hasNoCurrency = currency.value === ''

    if (amountMissing) return false

    return hasNoCurrency && hasValidAmount
  },
  set(val) {
    // ?
  },
})

// methods

/**
 * Select the amount when tapped in the field, for easier overwriting the value.
 * @param {Event} e
 */
function onAmountFocus(e: any) {
  e.target.select()
}
</script>
