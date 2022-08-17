<template>
  <q-item clickable class="text-amber-2 q-px-none">
    <q-item-section @click="itemClicked(tx.id)">
      <q-item-label>{{ tx.date }} {{ tx.payee }}</q-item-label>
      <q-item-label v-if="tx && tx.note" caption class="q-ml-lg text-colour2">{{
        tx.note
      }}</q-item-label>
      <q-item-label caption class="q-ml-lg text-amber-2">
        <div v-for="posting in tx.postings" :key="posting.id" class="row">
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
const props = defineProps({
  tx: Object,
})
</script>
<script>
export default {
  data() {
    return {
      confirmDelete: false,
    }
  },

  methods: {
    itemClicked(id) {
      this.$emit('click', id)
    },
  },
}
</script>
