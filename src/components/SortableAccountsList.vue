<template>
  <q-list dark separator class="bg-colour1 list">
    <slot />
  </q-list>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort'

export default {
  mixins: [ContainerMixin],

  data() {
    return {}
  },
}
</script>
