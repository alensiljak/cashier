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

    <div v-if="!tx.id" class="bg-primary text-center q-pa-sm q-ma-none">
      Creating a new transaction
    </div>
    <!-- Transaction -->
    <tx-editor />

    <q-separator dark />

    <!-- main (tx) Actions -->
    <div class="row q-my-xl justify-end text-center">
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
          Clear
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { SET_TRANSACTION, SET_SELECT_MODE } from '../mutations'
import appService from '../appService'
import TxEditor from '../components/TransactionEditor'
import { CurrentTransactionService } from '../lib/currentTransactionService'
import { TOGGLE_DRAWER } from '../mutations'
import { SettingKeys, settings } from 'src/lib/Configuration'
import { Setting } from 'src/model'

export default {
  components: {
    TxEditor
  },

  computed: {
    isNew: {
      get() {
        return this.tx.id === null
      }
    },
    tx: {
      get() {
        return new CurrentTransactionService(this.$store).getTx()
      },
      set(value) {
        // save in the state store
        new CurrentTransactionService(this.$store).setTx(value)
      }
    }
  },

  async created() {
    // for New Tx, clear the transaction store
    if (!this.tx) this.resetTransaction()

    // For Edit Tx, load the tx from database.
    try {
      await this.loadData()
    } catch (error) {
      this.$q.notify({ message: error.message, color: 'negative' })
    }
  },

  methods: {
    /**
     * Load all data for the view.
     */
    async loadData() {
      // Transaction
      const id = this.$route.params.id
      // Ignore string ids. This is coming from the route when 'back' clicked.
      if (typeof id === 'string') return

      if (id) {
        await this.loadTransaction(id)
      }
    },
    async loadTransaction(id) {
      const tx = await appService.loadTransaction(id)
      this.tx = tx
    },
    onClear() {
      // Resets all Transaction fields to defaults.
      this.resetTransaction()
    },
    async onSaveClicked() {
      try {
        await appService.saveTransaction(this.tx)

        const remember = await settings.get(SettingKeys.rememberLastTransaction)
        if (remember) {
          // todo: save as the last transaction for the payee
        }

        // clear Transaction entry
        this.onClear()

        this.$router.back()
      } catch (err) {
        console.error(err)
        this.$q.notify({ message: 'error: ' + err.message, color: 'negative' })
      }
    },
    resetTransaction() {
      const svc = new CurrentTransactionService(this.$store)
      const tx = svc.createTransaction()
      this.tx = tx
    },
    toggleDrawer() {
      const isOpen = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !isOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
</style>
