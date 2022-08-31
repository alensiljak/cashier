<template>
  <q-list dark separator class="bg-colour1 list">
    <slot />
  </q-list>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort'

export default {
  mixins: [ContainerMixin],

  props: {
    value: { type: Array, required: true },
  },

  emits: ['update:modelValue'],

  data() {
    return {}
  },

  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
    },
  },
}
</script>
