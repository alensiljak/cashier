<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transactions'" />

    <q-list dark>
      <q-item v-ripple clickable @click="showTx">
        <!-- <q-item-label>Label</q-item-label> -->
        <q-item-section>Scheduled transaction</q-item-section>
        <q-item-section side>
          <!-- top -->
          >
          <!-- <q-item-label caption>Skip</q-item-label>
          <q-item-label caption>Post</q-item-label> -->
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
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
      this.$router.push({ name: 'scheduledtxeditor' })
    },
    showTx(id) {
      this.$router.push({ name: 'scheduledtxeditor', params: { id: id }})
    }
  },
}
</script>