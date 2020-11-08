<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar :title="'New Transaction'" />

    <!-- Transaction -->
    <tx-editor />

    <q-separator dark />

    <!-- main (tx) Actions -->
    <div class="row q-my-xl justify-end">
      <div class="col text-center">
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
      <div class="col text-center">
        <q-btn
          class="q-px-lg"
          color="accent"
          text-color="secondary"
          size="medium"
          @click.once="onSave"
        >
          <font-awesome-icon
            icon="save"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Save
        </q-btn>
      </div>
    </div>
    <div class="row q-mb-xl justify-end">
      <div class="col text-center">
        <q-btn
          v-if="tx.id"
          color="secondary"
          text-color="accent"
          size="medium"
          @click.once="onDeleteClick"
        >
          <font-awesome-icon
            icon="trash-alt"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Delete
        </q-btn>
      </div>
      <div class="col text-center">
        <q-btn
          color="accent"
          text-color="secondary"
          size="medium"
          @click="onScheduleClick"
        >
          <font-awesome-icon
            icon="calendar-alt"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Schedule
        </q-btn>
      </div>
    </div>
    <div v-if="$store.getters.liveModeOn" class="text-center">
      <q-btn
        label="xact"
        color="secondary"
        text-color="accent"
        @click="onXactClicked"
      />
    </div>

    <!-- confirm tx deletion dialog -->
    <q-dialog
      v-model="confirmDeleteVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="accent"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { SET_TRANSACTION, SET_SELECT_MODE } from '../mutations'
import appService from '../appService'
import Toolbar from '../components/Toolbar'
import TxEditor from '../components/TransactionEditor'
import { CurrentTransactionService } from '../lib/currentTransactionService'

export default {
  components: {
    Toolbar,
    TxEditor
  },
  data() {
    return {
      confirmDeleteVisible: false,
    }
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
      },
    },
  },

  created() {
    // for New Tx, clear the transaction store
    if (!this.tx) this.resetTransaction()

    // For Edit Tx, load the tx from database.
    this.loadData()
  },

  methods: {
    /**
     * The user confirmed the deletion.
     */
    async confirmDelete() {
      await this.deleteTransaction()

      this.$router.push({ name: 'journal' })
    },
    async deleteTransaction() {
      let id = this.tx.id

      try {
        await appService.deleteTransaction(id)
        this.$q.notify({ message: 'Transaction deleted', color: 'positive' })

        this.resetTransaction()
      } catch (reason) {
        this.$q.notify({ message: reason.message, color: 'negative' })
      }
    },
    /**
     * Load all data for the view.
     */
    loadData() {
      // Transaction
      const id = this.$route.params.id
      if (id) {
        this.loadTransaction(id)
      }
    },
    async loadTransaction(id) {
      this.tx = await appService.loadTransaction(id)
    },
    onClear() {
      // Resets all Transaction fields to defaults.
      this.resetTransaction()
    },
    onDeleteClick() {
      // show the confirmation dialog.
      this.confirmDeleteVisible = true
    },
    async onSave() {
      try {
        await appService.saveTransaction(this.tx)
        // transaction committed
        // clear Transaction entry
        this.onClear()
        // go to journal?
        this.$router.push({ name: 'journal' })
      } catch (err) {
        console.error(err)
      }
    },
    onScheduleClick() {
      // the transaction stays in the store and is available in the sch.tx editor.
      this.$router.push({ name: 'scheduledtxeditor' })
    },
    onXactClicked() {
      this.$router.push({ name: 'xact', params: { payee: this.tx.payee } })
    },
    resetTransaction() {
      this.tx = new CurrentTransactionService(this.$store).createTransaction()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
</style>
