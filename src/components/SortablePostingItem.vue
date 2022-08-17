<template>
  <q-item v-ripple clickable class="list-item">
    <q-item-section>{{ posting.account }}</q-item-section>
    <q-item-section side>
      {{ posting.amount }} {{ posting.currency }}
    </q-item-section>
  </q-item>
</template>

<script>
import { ElementMixin } from 'vue-slicksort'

export default {
  mixins: [ElementMixin],

  props: {
    posting: { type: Object, default: null },
  },
}
</script>
