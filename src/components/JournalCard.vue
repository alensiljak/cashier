<template>
  <q-card dark bordered class="my-card" @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Device Journal</q-card-section> -->
    <q-card-section><strong>Device Journal</strong></q-card-section>

    <q-list dense>
      <q-item>yo</q-item>
    </q-list>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        flat
        dark
        color="primary"
        text-color="accent"
        @click.stop="onNewTxClick"
      >
        New
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  methods: {
    onCardClick() {
      // for some reason, need to explicitly forward the event
      this.$emit('click')
    },
    onNewTxClick() {
      this.$router.push({ name: 'newtx' })
    },
  },
}
</script>