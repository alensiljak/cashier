<template>
  <q-page padding class="bg-colour1 text-colour2" />
</template>

<script>
import {
  MAIN_TOOLBAR,
  SET_TITLE,
} from '../mutations'

export default {
  created() {
    this.$store.commit(SET_TITLE, 'Scheduled Transactions')
    this.$store.commit(MAIN_TOOLBAR, true)
  },
}
</script>