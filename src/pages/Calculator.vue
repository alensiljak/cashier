<template>
  <q-page padding class="text-colour2">
    <toolbar title="Number Entry" />

    <calculator-neu />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onAcceptClick">
        <check />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

</script>
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

  mounted() { },

  methods: {
    onAcceptClick() {
      this.$q.notify({ message: 'ok!', color: 'positive' })

      // todo: save the value to the state
    },
  },
}
</script>