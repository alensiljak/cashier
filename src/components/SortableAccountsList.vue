<template>
  <q-list dark separator class="bg-colour1 list">
    <slot />
  </q-list>
  <!-- <ul class="list">
    <slot />
  </ul> -->
</template>

<script>
import { ContainerMixin } from "vue-slicksort";

export default {
  mixins: [ContainerMixin],

  data() {
    return {};
  }
}
</script>
