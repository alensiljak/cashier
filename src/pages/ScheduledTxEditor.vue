<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transaction'" />

    <tx-editor />

    <q-separator dark class="q-my-lg" />

    <div>Schedule</div>

    <schedule-editor v-model="schedule" />

    <div class="text-center">
      <div class="row">
        <div class="col">
          <q-btn>Delete</q-btn>
        </div>
        <div class="col">
          <q-btn>Save</q-btn>
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

  computed: {

  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      const id = this.$route.params.id
      if (!id) {
        // create blank record
        this.scheduledTx = new ScheduledTransaction()
        this.transaction = new Transaction()

        const svc = new CurrentTransactionService()
      } else {
        console.log('loading sch.tx. ', id)

        // load existing record
        this.data = await appService.loadScheduledTransaction(id)
        // todo: parse transaction and schedule JSON?
        // this.transaction = ?
        // this.schedule = {}
      }
    },
    save() {
      //this.scheduledTx.id =
      // = new Date().getTime() <= set on save?
    },
  },
}
</script>
