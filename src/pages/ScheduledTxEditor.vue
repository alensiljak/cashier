<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />

    <tx-editor />

    <q-separator dark class="q-my-lg" />

    <schedule-editor v-model="scheduledTx" />

    <div class="text-center">
      <div class="row q-py-lg">
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
            @click.once="save"
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
          <q-btn class="q-mr-md">Skip</q-btn>
        </div>
        <div class="col">
          <q-btn>Enter</q-btn>
        </div>
      </div>
    </div>

    <div id="dialogs">
      <!-- confirm deletion dialog -->
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
            <q-btn v-close-popup flat label="Cancel" color="amber-4" />
            <q-btn
              v-close-popup
              flat
              label="Delete"
              color="amber-4"
              @click="confirmDelete"
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
      // scheduledTx: {}, // complete object
      transaction: {},
      confirmDeleteVisible: false,
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
    calculateSchedule() {
      const count = this.scheduledTx.count
      const period = this.scheduledTx.period
      const startDate = this.transaction.date
      const dateFormat = 'YYYY-MM-DD'

      // Get the start point.
      const start = moment(startDate)
      console.log('now:', start.format(dateFormat))

      // add the given period
      const next = start.add(count, period)
      console.log('next:', next.format(dateFormat))

      // calculate next iteration from the given date.
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
    async save() {
      if (!this.scheduledTx.id) {
        this.scheduledTx.id = new Date().getTime()
        console.log('new id generated:', this.scheduledTx.id)
      }
      // serialize transaction
      const txSvc = new CurrentTransactionService(this.$store)
      const tx = txSvc.getTx()
      const txStr = JSON.stringify(tx)
      this.scheduledTx.transaction = txStr

      this.scheduledTx.nextDate = tx.date

      const result = await appService.db.scheduled.put(this.scheduledTx)
      console.log('saved', result)

      if (result) {
        this.resetTransaction()
        this.$router.push({ name: 'scheduledtransactions' })
      }
    },
  },
}
</script>
