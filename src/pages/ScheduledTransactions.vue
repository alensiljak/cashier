<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transactions'" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="accent"
        text-color="secondary"
        @click="onFabClicked"
      >
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'

export default {
  components: {
    Toolbar,
  },

  methods: {
    onFabClicked() {
      this.$router.push({ name: 'newtx' })
    }
  }
}
</script>