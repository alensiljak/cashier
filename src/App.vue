<template>
  <router-view />
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Activate dark mode globally until the styling for the light version iscomplete
$q.dark.set(true)

onErrorCaptured(function (err, instance, info) {
  console.error('[errorCaptured]', err, instance, info)

  $q.notify({ color: 'secondary', message: err.message + instance + info })
})
</script>
<script lang="ts">
export default {
  name: 'App',

  provide: {
    //version: 'v2022.08.08'
  },
}
</script>
