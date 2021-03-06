<template>
  <q-page padding class="bg-colour1 text-colour2">
    <stx-toolbar
      title="Scheduled Transactions"
      @backup-clicked="onBackupClicked"
      @restore-clicked="onRestoreClicked"
      @filter-changed="onFilterChanged"
      @calendar-clicked="onCalendarClicked"
    />

    <div v-if="transactions.length === 0">
      There are no scheduled transactions
    </div>

    <q-list dark class="text-colour2">
      <!-- dense -->
      <q-item
        v-for="stx in filteredList"
        :key="stx.id"
        v-ripple
        clickable
        class="q-px-none"
        @click="showTx(stx.id)"
      >
        <!-- <q-item-label>Label</q-item-label> -->
        <q-item-section
          avatar
          :class="{
            red: stx.nextDate < today,
            yellow: stx.nextDate === today,
            green: stx.nextDate > today,
          }"
        >
          {{ stx.nextDate }}
        </q-item-section>
        <q-item-section>
          {{ JSON.parse(stx.transaction).payee }}
          <small class="remarks">{{ getFirstLine(stx.remarks) }}</small>
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import appService from '../appService'
import moment from 'moment'
import StxToolbar from '../components/ScheduledTxToolbar'

export default {
  components: {
    StxToolbar
  },

  data() {
    return {
      filter: null,
      transactions: [],
      today: null
    }
  },

  computed: {
    filteredList: {
      get() {
        if (!this.filter) {
          return this.transactions
        }

        if (!this.transactions) return

        // apply the filter
        return this.transactions.filter(stx => {
          const tx = JSON.parse(stx.transaction)
          //const result = (tx.payee.toUpperCase().indexOf(this.filter.toUpperCase()) > -1)

          // const result = stx.transaction.toUpperCase()
          //   .indexOf(this.filter.toUpperCase()) > -1

          // const result = stx.transaction.toLowerCase()
          //   .indexOf(this.filter.toLowerCase()) > -1

          // const result = stx.transaction
          //   .localeCompare(this.filter, undefined, { sensitivity: 'base' }) === 0

          // Use regex for performance.
          var searchTerm = new RegExp(this.filter, 'i')
          //const result = stx.transaction.match(searchTerm)
          const result = tx.payee.match(searchTerm)

          return result
        })
      }
    }
  },

  created() {
    this.today = moment().format('YYYY-MM-DD')
    this.loadData()
  },

  methods: {
    /**
    Gets only the first line of the text (until the first line break).
     */
    getFirstLine(text) {
      if (!text) return

      return text.split('\n')[0]
    },

    async loadData() {
      let sorted = await appService.db.scheduled
        .orderBy('nextDate')
        //.sortBy('symbol')
        .toArray()

      // sort also by payee, case insensitive
      sorted.sort((a, b) => {
        const tx1 = JSON.parse(a.transaction)
        const tx2 = JSON.parse(b.transaction)

        console.debug(tx1, tx2)

        var sorting = a.nextDate - b.nextDate
        return sorting == 0 
          ? tx.payee.localeCompare(tx2.payee, 'en', { sensitivity: 'base' })
          : sorting
      })

      console.debug(sorted)

      this.transactions = sorted
    },

    onBackupClicked() {
      this.$router.push({ name: 'export', params: { type: 'scheduled' } })
    },
    onCalendarClicked() {
      this.$router.push({ name: 'calendar' })
    },
    onFabClicked() {
      // reset any cached values
      this.$store.commit('saveToClipboard', null)
      this.$router.push({ name: 'scheduledtxeditor' })
    },
    onFilterChanged(filter) {
      this.filter = filter
    },
    onRestoreClicked() {
      this.$router.push({ name: 'restore', params: { type: 'scheduled' } })
    },
    showTx(id) {
      this.$router.push({ name: 'scheduledtxactions', params: { id: id } })
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../css/palette.scss"

.red
  color: $negative

.yellow
  color: $warning

.green
  color: $positive

.remarks
  color: $colour2
</style>
