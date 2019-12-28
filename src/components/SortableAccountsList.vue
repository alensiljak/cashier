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
// import { SortableAccountItem } from './SortableAccountItem'

export default {
  mixins: [ContainerMixin],

  data() {
    return {};
  }

  // props: ["accounts"],
}
</script>
