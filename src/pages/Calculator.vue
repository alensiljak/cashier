<template lang="html">
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Number Entry" />
  
    <calculator-neu />
  </q-page>
</template>
<script>
import Toolbar from '../components/Toolbar'
import CalculatorNeu from '../components/CalculatorNeu.vue'
export default {
    components: {
        CalculatorNeu,
        Toolbar
    }
}
</script>