<template>
  <q-page padding class="bg-colour1 text-colour2">
    <stx-toolbar
      title="Scheduled Transactions"
      @backup-clicked="onBackupClicked"
      @restore-clicked="onRestoreClicked"
      @filter-changed="onFilterChanged"
    />

    <div v-if="transactions.length === 0">
      There are no scheduled transactions
    </div>

    <q-list dark class="text-colour2">
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
// import Toolbar from '../components/Toolbar'
import appService from '../appService'
import moment from 'moment'
import StxToolbar from '../components/ScheduledTxToolbar'

export default {
  components: {
    StxToolbar,
    // Toolbar,
  },

  data() {
    return {
      filter: null,
      transactions: [],
      today: null,
    }
  },

  computed: {
    filteredList: {
      get() {
        if (!this.filter) {
          return this.transactions
        }

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
          var searchTerm = new RegExp(this.filter, "i")
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
    async loadData() {
      this.transactions = await appService.db.scheduled
        // .where({ transaction: tx.id })
        .orderBy('nextDate')
        .toArray()
    },
    onBackupClicked() {
      this.$router.push({ name: 'export', params: { type: 'scheduled' } })
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
      this.$router.push({ name: 'scheduledtxactions', params: { id: id }})
    },
  },
}
</script>
<style lang="sass" scoped>
.red
  color: $negative

.yellow
  color: $warning

.green
  color: $positive
</style>