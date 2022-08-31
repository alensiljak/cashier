<template>
  <q-item clickable class="text-amber-2 q-px-none">
    <q-item-section @click.once="$emit('click', tx.id)">
      <q-item-label>{{ tx?.date }} {{ tx?.payee }}</q-item-label>
      <q-item-label v-if="tx && tx.note" caption class="q-ml-lg text-colour2">{{
        tx.note
      }}</q-item-label>
      <q-item-label caption class="q-ml-lg text-amber-2">
        <div v-for="posting in tx?.postings" :key="posting.id" class="row">
          <div class="col">{{ posting.account }}</div>
          <div v-if="posting.amount">
            {{ posting.amount }} {{ posting.currency }}
          </div>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref } from 'vue'
//import { inject } from 'vue'

//inject('tx')

const emit = defineEmits(['click'])

const confirmDelete = ref(false)

const props = defineProps({
  tx: { type: Object, default: null },
})
</script>
