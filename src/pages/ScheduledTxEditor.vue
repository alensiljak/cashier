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
          <q-btn>Delete</q-btn>
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
      schedule: {
        count: null,
        period: null,
        endDate: null,
      },
    }
  },

  computed: {},

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
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        // todo: enable this after testing.
        // this.resetTransaction()
      } else {
        console.log('loading sch.tx. ', id)

        // load existing record
        this.scheduledTx = await appService.loadScheduledTransaction(id)
        this.transaction = JSON.parse(this.scheduledTx.transaction)
        this.schedule = {
          count: this.scheduledTx.count,
          period: this.scheduledTx.period,
          endDate: this.scheduledTx.endDate,
        }
      }
    },
    resetTransaction() {
      // create blank record
      this.scheduledTx = new ScheduledTransaction()

      const svc = new CurrentTransactionService(this.$store)
      const tx = svc.createTransaction()
      svc.setTx(tx)
      this.transaction = tx
    },
    async save() {
      if (!this.scheduledTx.id) {
        this.scheduledTx.id = new Date().getTime()
      }
      // serialize transaction
      const txSvc = new CurrentTransactionService(this.$store)
      const tx = txSvc.getTx()
      const txStr = JSON.stringify(tx)
      this.scheduledTx.transaction = txStr

      // save schedule input parameters
      this.scheduledTx.endDate = this.schedule.endDate
      this.scheduledTx.count = this.schedule.count
      this.scheduledTx.period = this.schedule.period

      const result = await appService.db.scheduled.put(this.scheduledTx)
      console.log(result)
    },
  },
}
</script>
