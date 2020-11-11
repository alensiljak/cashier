<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar title="Scheduled Transaction Actions" />

    <journal-transaction :tx="tx" />

    <div class="q-pt-sm">
      <span v-if="scheduledTx.count">
        Repeats every {{ scheduledTx.count }} {{ scheduledTx.period }}
      </span>
      <span v-if="scheduledTx.endDate">until {{ scheduledTx.endDate }}</span>
    </div>

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Enter -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="enterConfirmationVisible = true"
      >
        <font-awesome-icon
          icon="scroll"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Enter
      </q-btn>
      <!-- Skip -->
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="skipConfirmationVisible = true"
      >
        <font-awesome-icon
          icon="forward"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Skip
      </q-btn>
      <!-- Edit -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onEditClicked"
      >
        <font-awesome-icon
          icon="save"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Edit
      </q-btn>
      <!-- Delete -->
      <q-btn
        color="secondary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
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
    <div id="dialogs">
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
import JournalTransaction from '../components/JournalTransaction'
import appService from '../appService'
import moment from 'moment'

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
      scheduledTx: {},
      confirmDeleteVisible: false,
      skipConfirmationVisible: false,
      enterConfirmationVisible: false,
    }
  },
  computed: {
    tx: {
      get() {
        if (!this.scheduledTx || !this.scheduledTx.transaction) {
          return {}
        }
        return JSON.parse(this.scheduledTx.transaction)
      },
      set(value) {
        this.scheduledTx.transaction = JSON.stringify(value)
      }
    }
  },
  async created() {
    await this.load()
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

      //this.resetTransaction()

      //this.$router.push({ name: 'scheduledtransactions' })
      this.$router.back()
    },
    /**
     * enter the transaction into journal and update the next date on schedule.
     */
    async enterTransaction() {
      // Create the journal transaction.
      const tx = this.tx
      // delete the id field, if any, to get a new one on save.
      tx.id = null
      const id = await appService.saveTransaction(tx)

      // update the iteration date
      await this.skip()

      this.$q.notify({ message: 'Transaction created', color: 'positive' })

      // open the transaction. Maintain page navigation history.
      this.$router.replace({ name: 'tx', params: { id: id }})
    },
    getNumericId() {
      // when navigating back, the id becomes string instead of original numeric
      if (typeof this.id === 'string') {
        return Number(this.id)
      }
      if (typeof this.id === 'number') {
        return this.id
      }

      throw new Error('Invalid Id value', this.id)
    },
    async load() {
      const id = this.getNumericId()
      const schTx = await appService.db.scheduled.get(id)
      this.scheduledTx = schTx

      const tx = JSON.parse(schTx.transaction)
      this.tx = tx
    },
    onEditClicked() {
      // open the editor
      const id = this.getNumericId()
      this.$router.push({ name: 'scheduledtxeditor', params: { id: id } })
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

        this.$router.back()
      } catch (err) {
        this.$q.notify({ color: 'negative', message: err.message })
      }
    },
    async saveData() {
      // Saves the Stx record

      // serialize transaction
      const tx = this.tx
      // do not store any transaction ids!
      tx.id = null
      this.tx = tx

      const stx = this.scheduledTx

      // reuse transaction date. For indexing only.
      stx.nextDate = tx.date

      const result = await appService.saveScheduledTransaction(stx)
      // console.log('saved', result)
      return result
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
      let tx = this.tx
      tx.date = newDate
      this.tx = tx

      const result = await this.saveData()
      if (!result) {
        this.$q.notify({ message: 'transaction not saved!', color: 'negative'})
      }
    },
  },
}
</script>
