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
            v-if="scheduledTx && scheduledTx.id"
            color="secondary"
            text-color="accent"
            size="medium"
            @click.once="confirmDeleteVisible = true"
          >
            <font-awesome-icon
              icon="trash-alt"
              transform="grow-9"
              class="q-icon-small on-left"
            />
            Delete
          </q-btn>
        </div>
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
      <div class="row q-pb-lg">
        <div class="col">
          <q-btn
            color="primary"
            text-color="accent"
            @click="skipConfirmationVisible = true"
          >
            <font-awesome-icon
              icon="forward"
              transform="grow-9"
              class="q-icon-small on-left"
            />
            Skip
          </q-btn>
        </div>
        <div class="col">
          <q-btn
            color="accent"
            text-color="secondary"
            @click="enterConfirmationVisible = true"
          >
            <font-awesome-icon
              icon="scroll"
              transform="grow-9"
              class="q-icon-small on-left"
            />
            Enter
          </q-btn>
        </div>
      </div>
    </div>

    <div id="dialogs">
      <!-- confirm stx deletion dialog -->
      <q-dialog
        v-model="confirmDeleteVisible"
        persistent
        content-class="bg-blue-grey-10"
      >
        <q-card dark class="bg-secondary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to delete the scheduled transaction?</span>
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
      <!-- 'Skip' confirmation dialog -->
      <q-dialog
        v-model="skipConfirmationVisible"
        persistent
        content-class="bg-blue-grey-10"
      >
        <q-card dark class="bg-primary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to skip the next iteration?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn
              v-close-popup
              flat
              label="Yes"
              color="accent"
              @click="onSkipConfirmed"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- 'Enter' confirmation dialog -->
      <q-dialog
        v-model="enterConfirmationVisible"
        persistent
        content-class="bg-blue-grey-10"
      >
        <q-card dark class="bg-primary text-amber-2">
          <q-card-section class="row items-center">
            <span>Do you want to enter this transaction into the journal?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn
              v-close-popup
              flat
              label="Yes"
              color="accent"
              @click="onEnterConfirmed"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
import moment from 'moment'

export default {
  components: {
    Toolbar,
    ScheduleEditor,
    TxEditor,
  },

  data() {
    return {
      // transaction: {},
      confirmDeleteVisible: false,
      skipConfirmationVisible: false,
      enterConfirmationVisible: false,
    }
  },

  computed: {
    scheduledTx: {
      get() {
        let result = this.$store.getters.clipboard
        // if (!result) {
        //   result = new ScheduledTransaction()
        // }
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
      // console.debug('initializing the sctx')
      this.scheduledTx = new ScheduledTransaction()
    }

    try {
      await this.loadData()
    } catch(error) {
        this.$q.notify({message: error.message, color: 'negative'})
    }
  },

  methods: {
    /**
     * Calculate the schedule based on the given parameters.
     */
    calculateNextIteration(startDate, count, period, endDate) {
      // calculate next iteration from the given date.

      if (!startDate || !count || !period) {
        throw new Error(
          `missing input parameter(s), received: ${startDate} ${count} ${period}`
        )
      }

      const isoDateFormat = 'YYYY-MM-DD'

      // Get the start point.
      const start = moment(startDate)
      console.debug('now:', start.format(isoDateFormat))

      // add the given period
      const next = start.add(count, period)
      let output = next.format(isoDateFormat)

      // handle end date.
      if (endDate) {
        if (output > endDate) {
          // no more iterations, end date passed
          return null
        }
      }

      console.debug('next:', output)

      return output
    },
    async confirmDelete() {
      const id = this.scheduledTx.id
      if (!id) {
        console.error('the current scheduled transaction does not have an id')
        return
      }

      const result = await appService.db.scheduled
        .where('id')
        .equals(id)
        .delete()
      console.log('deletion result:', result)

      this.resetTransaction()

      this.$router.push({ name: 'scheduledtransactions' })
    },
    async enterTransaction() {
      // enter the transaction into journal and update the next date on schedule
      // save journal transaction
      const txSvc = new CurrentTransactionService(this.$store)
      const tx = txSvc.getTx()
      // delete the id field, if any
      tx.id = null
      const id = await appService.saveTransaction(tx)

      // update iteration date
      await this.skip()

      this.$q.notify({ message: 'Transaction created', color: 'positive' })

      // open the transaction?
      //this.$router.push({ name: 'tx', params: { id: id }})
      this.$router.push({ name: 'journal' })
    },
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
    async onEnterConfirmed() {
      try {
        await this.enterTransaction()
      } catch (err) {
        this.$q.notify({ color: 'negative', message: err.message })
      }
    },
    async onSkipConfirmed() {
      try {
        await this.skip()

        this.$router.push({ name: 'scheduledtransactions' })
      } catch (err) {
        this.$q.notify({ color: 'negative', message: err.message })
      }
    },
    async skip() {
      // Skips the next iteration.

      let stx = this.scheduledTx
      const startDate = stx.nextDate
      const count = stx.count
      const period = stx.period
      const endDate = stx.endDate

      // todo: handle the one-off occurrence (no count and no period)

      // calculate the next iteration.
      let newDate = this.calculateNextIteration(
        startDate,
        count,
        period,
        endDate
      )
      if (!newDate) {
        // throw new Error(`invalid date calculated: ${newDate}`)
        // Passed the End Date.
        newDate = '0000-00-00'
      }

      // update the date on the transaction
      const txSvc = new CurrentTransactionService(this.$store)
      const tx = txSvc.getTx()
      tx.date = newDate
      txSvc.setTx(tx)

      await this.saveData()

      // refresh the view
      this.use(stx)
    },
    /**
     * Sets the given Scheduled Transaction as the active object, being edited.
     */
    use(scheduledTransaction) {
      // console.debug('using', scheduledTransaction)

      // if (this.scheduledTx === null) {
      //   this.scheduledTx = new ScheduledTransaction()
      // }
      // transfer the properties to the reactive model.
      // todo: check if this is needed.
      // for (var prop in scheduledTransaction) {
      //   if (Object.prototype.hasOwnProperty.call(scheduledTransaction, prop)) {
      //     this.$set(this.scheduledTx, prop, scheduledTransaction[prop])
      //   }
      // }
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
<style lang="sass" scoped>
.actionButton
  bg-color: $accent
</style>
