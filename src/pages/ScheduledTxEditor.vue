<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />

    <tx-editor />

    <q-separator dark class="q-my-lg" />

    <div>Schedule</div>

    <schedule-editor v-model="schedule" />

    <div class="text-center">
      <div class="row q-py-lg">
        <div class="col">
          <q-btn @click="confirmDeleteVisible = true">Delete</q-btn>
        </div>
        <div class="col">
          <q-btn @click.once="save">Save</q-btn>
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
      scheduledTx: {}, // complete object
      transaction: {},
      confirmDeleteVisible: false
    }
  },

  computed: {
    schedule: {
      get() {
        let result = this.$store.getters.clipboard
        if (!result) {
          result = {
            count: null,
            period: null,
            endDate: null,
          }
        }
        return result
      },
      set(value) {
        this.$store.commit('saveToClipboard', value)
      },
    },
  },

  async created() {
    await this.loadData()
  },

  methods: {
    /**
     * Calculate the schedule based on the given parameters.
     */
    calculateSchedule() {
      const count = this.schedule.count
      const period = this.schedule.period
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
        .where('id').equals(id)
        .delete()
      console.log('deletion result:', result)

      this.resetTransaction()

      this.$router.push({ name: 'scheduledtransactions'})
    },
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        // todo: enable this after testing.
        // this.resetTransaction()
        console.log('blank transaction')
      } else {
        console.log('loading sch.tx. ', id)

        // load existing record
        this.scheduledTx = await appService.db.scheduled.get(id)
        this.transaction = JSON.parse(this.scheduledTx.transaction)

        // make tx available for editing
        const txSvc = new CurrentTransactionService(this.$store)
        txSvc.setTx(this.transaction)

        this.schedule.count = this.scheduledTx.count
        this.schedule.period = this.scheduledTx.period
        this.schedule.endDate = this.scheduledTx.endDate
      }
    },
    resetTransaction() {
      // create blank record
      this.scheduledTx = new ScheduledTransaction()

      const svc = new CurrentTransactionService(this.$store)
      const tx = svc.createTransaction()
      svc.setTx(tx)
      this.transaction = tx

      // Reset the schedule
      this.schedule = null
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

      // save schedule input parameters
      this.scheduledTx.endDate = this.schedule.endDate
      this.scheduledTx.count = this.schedule.count
      this.scheduledTx.period = this.schedule.period

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
