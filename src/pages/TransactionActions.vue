<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar title="Transaction Actions" />

    <journal-transaction :tx="tx" />

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Edit -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click.once="onEditClicked"
      >
        <font-awesome-icon
          icon="save"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Edit
      </q-btn>
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onScheduleClick"
      >
        <font-awesome-icon
          icon="calendar-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Schedule
      </q-btn>
      <q-btn
        v-if="$store.getters.liveModeOn"
        size="1.3rem"
        color="primary"
        text-color="accent"
        class="q-my-lg q-mx-md"
        @click="onXactClicked"
      >
        <font-awesome-icon
          icon="scroll"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        xact
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onCopyClicked"
      >
        <font-awesome-icon
          icon="copy"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        copy ledger entry
      </q-btn>
      <q-btn
        v-if="tx.id"
        color="secondary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onDeleteClick"
      >
        <font-awesome-icon
          icon="trash-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Delete
      </q-btn>
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
import Toolbar from '../components/Toolbar'
import JournalTransaction from '../components/JournalTransaction'
import appService from '../appService'
import { CurrentTransactionService } from '../lib/currentTransactionService'

export default {
  components: {
    Toolbar,
    JournalTransaction,
  },
  props: {
    id: { type: Number, default: null },
  },
  data() {
    return {
      tx: {},
      confirmDeleteVisible: false,
    }
  },
  async created() {
    await this.load()
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
      const id = this.getNumericId()

      try {
        await appService.deleteTransaction(id)
        this.$q.notify({ message: 'Transaction deleted', color: 'positive' })

        this.resetTransaction()
      } catch (reason) {
        this.$q.notify({ message: reason.message, color: 'negative' })
      }
    },
    getNumericId() {
      // when navigating back, the id becomes string instead of original numeric
      if(typeof(this.id) === 'string') {
        return Number(this.id)
      }
      if(typeof(this.id) === 'number') {
        return this.id
      }

      throw new Error('Invalid Id value')
    },
    async load() {
      const id = this.getNumericId()
      const tx = await appService.loadTransaction(id)
      this.tx = tx
    },
    async onCopyClicked() {
      // get a journal version
      const text = await appService.translateToLedger(this.tx)

      // copy to clipboard
      await navigator.clipboard.writeText(text)
      this.$q.notify({
        message: 'transaction copied to clipboard',
        color: 'positive',
      })
    },
    onDeleteClick() {
      // show the confirmation dialog.
      this.confirmDeleteVisible = true
    },
    onEditClicked() {
      const id = this.getNumericId()
      this.$router.push({ name: 'tx', params: { id: id } })
    },
    onScheduleClick() {
      // the journal transaction stays in the store and is available in the sch.tx editor.
      // id 0 will cause it to reset the scheduled transaction.
      // Save the tx to the store first.
      new CurrentTransactionService(this.$store).setTx(this.tx)

      this.$router.push({ name: 'scheduledtxeditor', params: { id: 0 } })
    },
    onXactClicked() {
      this.$router.push({ name: 'xact', params: { payee: this.tx.payee } })
    },
  },
}
</script>
<style lang="sass" scoped>
.large-button
  width: 90%
</style>
