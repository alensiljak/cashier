<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />

    <tx-editor />

    <q-separator dark class="q-my-lg" />

    <schedule-editor v-model="scheduledTx" />

    <div id="actions" class="text-center">
      <div class="row q-py-xl">
        <div class="col">
          <q-btn
            class="q-px-lg"
            color="accent"
            text-color="secondary"
            size="medium"
            @click.once="onSaveClicked"
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
    </div>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import TxEditor from '../components/TransactionEditor'
import ScheduleEditor from '../components/ScheduleEditor'
import appService from '../appService'
import { CurrentTransactionService } from '../lib/currentTransactionService'
import { ScheduledTransaction, Transaction } from '../model'

export default {
  components: {
    Toolbar,
    ScheduleEditor,
    TxEditor,
  },

  computed: {
    scheduledTx: {
      get() {
        let result = this.$store.getters.clipboard
        return result
      },
      set(value) {
        this.$store.commit('saveToClipboard', value)
      },
    },
  },

  async created() {
    if (!this.scheduledTx) {
      // initialize for data binding.
      this.scheduledTx = new ScheduledTransaction()
    }

    try {
      await this.loadData()
    } catch(error) {
        this.$q.notify({message: error.message, color: 'negative'})
    }
  },

  methods: {
    async loadData() {
      const id = this.$route.params.id
      //console.debug('id', id, 'type', typeof(id))
      // temporary workaround: if the id type is not numeric, just use the values
      // from the store.
      if (typeof(id) === 'string') return

      // Special case. ID of 0 should be used to reset the Sch.Tx in the state.
      // This is necessary for the case when using a transction from the journal editor.
      if (id === 0) {
        // Reset the Scheduled transaction.
        this.scheduledTx = new ScheduledTransaction()
        // But use the journal transaction from the state
      }

      if (!id) {
        // todo: enable this after testing.
        // this.resetTransaction()
        //console.log('blank transaction, using clipboard values')
      } else {
        console.log('loading sch.tx', id)

        // load existing record
        let schTx = await appService.db.scheduled.get(id)
        if(!schTx) {
          throw new Error('Scheduled transaction not loaded', id)
        }
        // console.debug('loaded', schTx)
        this.use(schTx)
      }
    },
    /**
     * Sets the given Scheduled Transaction as the active object, being edited.
     */
    use(scheduledTransaction) {
      // save to store
      this.scheduledTx = scheduledTransaction

      // put into the store the attached journal transaction.
      const transaction = JSON.parse(scheduledTransaction.transaction)

      // make tx available for editing
      const txSvc = new CurrentTransactionService(this.$store)
      txSvc.setTx(transaction)
    },
    resetTransaction() {
      // create blank record
      // this.scheduledTx = new ScheduledTransaction()

      // const svc = new CurrentTransactionService(this.$store)
      // const tx = svc.createTransaction()
      // svc.setTx(tx)
      //this.transaction = tx

      // Reset the schedule
      // this.scheduledTx = null

      this.use(new ScheduledTransaction())
    },
    async saveData() {
      // Saves the Stx record

      const stx = this.scheduledTx

      if (!stx.id) {
        stx.id = new Date().getTime()
        // console.log('new id generated:', this.scheduledTx.id)
      }
      // serialize transaction
      const txSvc = new CurrentTransactionService(this.$store)
      const tx = txSvc.getTx()
      // do not store any transaction ids!
      tx.id = null
      const txStr = JSON.stringify(tx)
      stx.transaction = txStr

      // reuse transaction date. For indexing only.
      stx.nextDate = tx.date

      const result = await appService.db.scheduled.put(stx)
      // console.log('saved', result)
      return result
    },
    async onSaveClicked() {
      /// Triggered on Save button click

      const result = await this.saveData()

      if (result) {
        this.resetTransaction()
        //this.$router.push({ name: 'scheduledtransactions' })
        this.$router.back()
      }
    },
  },
}
</script>
