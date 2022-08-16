<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <!-- toolbar -->
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

        <q-toolbar-title>Journal Transaction</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <div v-if="!tx || !tx.id" class="bg-primary text-center q-pa-sm q-ma-none">
      New transaction
    </div>

    <!-- Transaction -->
    <tx-editor />

    <q-separator dark />

    <!-- main (tx) Actions -->

    <footer class="row q-my-xl justify-end text-center">
      <!-- Reset -->
      <div class="col">
        <q-btn
          color="secondary"
          text-color="accent"
          size="medium"
          @click="onClear"
        >
          <font-awesome-icon
            icon="times-circle"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Reset
        </q-btn>
      </div>
      <!-- save -->
      <div class="col">
        <q-btn
          color="accent"
          text-color="secondary"
          size="medium"
          @click="onSaveClicked"
        >
          <font-awesome-icon
            icon="save"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Save
        </q-btn>
      </div>
    </footer>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="isConfirmDeleteVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary">
        <q-card-section class="row items-center">
          <span>Do you want to clear all the fields?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Confirm"
            color="accent"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useRoute } from 'vue-router'

const router = useRoute()
const mainStore = useMainStore()
const { tx } = mainStore

// for New Tx, clear the transaction store
//if (!tx) resetTransaction()

onMounted(async () => {
  //
})
</script>
<script>
import appService from '../appService'
import TxEditor from '../components/TransactionEditor.vue'
import { SettingKeys, settings } from 'src/lib/Configuration'
import eventBus from '../lib/eventBus'
import { toRaw } from 'vue'

export default {
  components: {
    TxEditor,
  },

  data() {
    return {
      isConfirmDeleteVisible: false,
    }
  },

  methods: {
    confirmDelete() {
      // Resets all Transaction fields to defaults.
      this.resetTransaction()
    },

    onClear() {
      this.isConfirmDeleteVisible = true
    },
    async onSaveClicked() {
      try {
        let tx = toRaw(this.tx)

        await appService.saveTransaction(tx)

        // Remember Last Transaction?
        const remember = await settings.get(SettingKeys.rememberLastTransaction)
        if (remember) {
          await appService.saveLastTransaction(tx)
        }

        await this.$router.back()
      } catch (err) {
        console.error(err)
        this.$q.notify({ message: 'error: ' + err.message, color: 'negative' })
      }
    },
    resetTransaction() {
      this.mainStore.newTx()
    },
    toggleDrawer() {
      eventBus.$emit('toggle-drawer')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
</style>
