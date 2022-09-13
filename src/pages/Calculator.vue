<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Number Entry" />

    <calculator-neu />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="check"
        color="accent"
        text-color="secondary"
        @click="onAcceptClick"
      />
    </q-page-sticky>
  </q-page>
</template>
<script lang="ts">
import Toolbar from 'src/components/CashierToolbar.vue'
import CalculatorNeu from '../components/CalculatorNeu.vue'
export default {
  components: {
    CalculatorNeu,
    Toolbar,
  },

  created() {
    // todo: load the appropriate value from the state.
  },

  mounted() {},

  methods: {
    onAcceptClick() {
      this.$q.notify({ message: 'ok!', color: 'positive' })

      // todo: save the value to the state
    },
  },
}
</script>