<template>
  <q-item clickable v-ripple class="list-item">
    <q-item-section>{{ account.name }}</q-item-section>
    <q-item-section side>{{ account.balance}} {{account.currency}}</q-item-section>
  </q-item>

  <!-- <li class="list-item">{{item}}</li> -->
</template>

<script>
import { ElementMixin } from "vue-slicksort";

export default {
  mixins: [ElementMixin],
  props: ["account"]
};
</script>
