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
            v-if="scheduledTx.id"
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
      <div class="row">
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
        <q-card dark class="bg-red-10 text-amber-2">
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
            <span>Do you want to enter this transaction into journal?</span>
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
      transaction: {},
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

  created() {
    if (this.scheduledTx === null) {
      this.scheduledTx = new ScheduledTransaction()
    }

    this.loadData()
  },

  methods: {
    /**
     * Calculate the schedule based on the given parameters.
     */
    calculateNextIteration(startDate, count, period, endDate) {
      // calculate next iteration from the given date.

      if (!startDate || !count || !period || !endDate) {
        throw new Error(`missing input parameter(s), received: ${startDate} ${count} ${period}`)
      }

      const isoDateFormat = 'YYYY-MM-DD'

      // Get the start point.
      const start = moment(startDate)
      console.debug('now:', start.format(isoDateFormat))

      // add the given period
      const next = start.add(count, period)

      // todo: handle end date.
      // if next > endDate return null

      const output = next.format(isoDateFormat)
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
      const id = await appService.saveTransaction(tx)

      // update iteration date
      await this.skip()

      // open the transaction
      this.$router.push({ name: 'tx', params: { id: id }})
    },
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        // todo: enable this after testing.
        // this.resetTransaction()
        console.log('blank transaction, using clipboard values')
      } else {
        console.log('loading sch.tx. ', id)

        // load existing record
        const schTx = await appService.db.scheduled.get(id)
        this.use(schTx)
      }
    },
    async onEnterConfirmed() {
      try {
        await this.enterTransaction()
      } catch(err) {
        this.$q.notify({ color: 'negative', message: err.message })
      }
    },
    async onSkipConfirmed() {
      try {
        await this.skip()
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

      // calculate the next iteration.
      let newDate = this.calculateNextIteration(startDate, count, period, endDate)
      if (!newDate) {
        throw new Error(`invalid date calculated: ${newDate}`)
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
      if (this.scheduledTx === null) {
        this.scheduledTx = new ScheduledTransaction()
      }

      // transfer the properties to reactive model
      for (var prop in scheduledTransaction) {
        if (Object.prototype.hasOwnProperty.call(scheduledTransaction, prop)) {
          this.$set(this.scheduledTx, prop, scheduledTransaction[prop])
        }
      }
      // save to store
      this.scheduledTx = scheduledTransaction

      this.transaction = JSON.parse(scheduledTransaction.transaction)

      // make tx available for editing
      const txSvc = new CurrentTransactionService(this.$store)
      txSvc.setTx(this.transaction)
    },
    resetTransaction() {
      // create blank record
      this.scheduledTx = new ScheduledTransaction()

      const svc = new CurrentTransactionService(this.$store)
      const tx = svc.createTransaction()
      svc.setTx(tx)
      this.transaction = tx

      // Reset the schedule
      this.scheduledTx = null
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
        this.$router.push({ name: 'scheduledtransactions' })
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.actionButton
  bg-color: $accent
</style>