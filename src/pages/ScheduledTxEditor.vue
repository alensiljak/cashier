<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title>Scheduled Transaction Edit</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <tx-editor />

    <q-separator dark class="q-my-lg" />

    <schedule-editor v-model="scheduledTx" />
  </q-page>
</template>
<script setup>
import { onMounted, provide, reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
// import { useRoute } from 'vue-router'
import appService from '../appService'
import { useMainStore } from '../store/mainStore'

const store = useStore()
const $q = useQuasar()
const mainStore = useMainStore()

const { scheduledTx, tx } = mainStore

// are we back from the select mode?
if (store.state.selectModeMeta) {
  //handleSelection()
}

// onCreated

provide('scheduledTx', scheduledTx)
</script>
<script>
import TxEditor from '../components/TransactionEditor.vue'
import ScheduleEditor from '../components/ScheduleEditor.vue'
import eventBus from '../lib/eventBus'
import { toRaw } from 'vue'

export default {
  components: {
    ScheduleEditor,
    TxEditor,
  },

  methods: {
    resetTransaction() {
      this.mainStore.newScheduledTx()
    },
    /**
     * Saves the scheduled transaction to the data store.
     */
    async saveData() {
      let stx = toRaw(this.scheduledTx)

      // serialize transaction
      let tx = toRaw(this.tx)
      // clear any transaction ids!
      tx.id = null
      const txStr = JSON.stringify(tx)
      stx.transaction = txStr

      // reuse transaction date. For indexing only.
      stx.nextDate = tx.date

      const result = await appService.saveScheduledTransaction(stx)
      return result
    },
    async onSaveClicked() {
      const result = await this.saveData()

      if (result) {
        this.$router.back()
      }
    },
    toggleDrawer() {
      eventBus.$emit('toggle-drawer')
    },
  },
}
</script>
