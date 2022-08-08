<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Transaction Search'" />

    <!-- date -->
    <q-select
      v-model="datePeriod"
      :options="datePeriods"
      label="Date Period"
      dark
      @input="onDatePeriodChanged"
    />

    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-card dark>
        <q-card-section class="q-pa-none">
          <q-date
            ref="datePicker"
            v-model="dateFrom"
            dark
            first-day-of-week="1"
            today-btn
            mask="YYYY-MM-DD"
            @input="onDateSelected"
          />
        </q-card-section>
        <q-separator dark />
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="OK"
            flat
            color="secondary"
            text-color="accent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-input
      v-model="dateFrom"
      label="Date From"
      dark
      @click="datePickerVisible = true"
    >
      <template #prepend>
        <font-awesome-icon icon="calendar-day" />
      </template>
    </q-input>

    <q-dialog ref="qDateToProxy" v-model="dateToPickerVisible">
      <q-card dark>
        <q-card-section class="q-pa-none">
          <q-date
            ref="dateToPicker"
            v-model="dateTo"
            dark
            first-day-of-week="1"
            today-btn
            mask="YYYY-MM-DD"
            @input="onDateToSelected"
          />
        </q-card-section>
        <q-separator dark />
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="OK"
            flat
            color="secondary"
            text-color="accent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-input
      v-model="dateTo"
      label="Date To"
      dark
      @click="dateToPickerVisible = true"
    >
      <template #prepend>
        <font-awesome-icon icon="calendar-day" />
      </template>
    </q-input>

    <!-- payee -->
    <q-input v-model="payee" label="Payee" dark @keypress="handleEnter">
      <template #prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>

    <!-- free text -->
    <q-input
      v-model="freeText"
      label="Free-text search"
      dark
      @keypress="handleEnter"
    />

    <p>
      Hints: ^ = begins with, $ = ends with, --related and --related-all show
      related postings, use 'and' for multiple search criteria.
    </p>

    <!-- search button -->
    <div class="text-center q-my-lg">
      <q-btn color="secondary" text-color="accent" @click="search">
        <font-awesome-icon
          icon="search"
          transform="grow-6 right-6"
          class="q-mr-sm"
        />
        <span class="q-ml-sm">Search</span>
      </q-btn>
    </div>

    <!-- results -->
    <q-list dark separator>
      <q-item v-for="tx in results" :key="tx.id" v-ripple clickable>
        <q-item-section>
          <!-- <q-item-label overline>
            {{ tx.header.date }} {{ tx.header.payee }}
          </q-item-label> -->
          <q-item-label>
            <span class="q-mr-sm">{{ tx.header.date }}</span> {{ tx.header.payee }}
          </q-item-label>
          <q-item-label v-for="(posting, index) in tx.postings" :key="index" caption
                        class="q-ml-md"
          >
            {{ posting.account }}
            <span style="float: right;">{{ posting.amount }} {{ posting.currency }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { settings, SettingKeys } from 'src/lib/Configuration'
import { CashierSync } from '../lib/syncCashier'
import { date } from 'quasar'
const { subtractFromDate, addToDate } = date
//import { RecycleScroller } from 'vue-virtual-scroller'
import Toolbar from '../components/Toolbar'

//import * as Vue from 'vue'
//Vue.component('RecycleScroller', RecycleScroller)

export default {
  components: {
    Toolbar, 
    //RecycleScroller
  },

  data() {
    return {
      freeText: null,
      datePeriods: [
        'Today',
        'Last Week',
        'Last Month',
        'Last Quarter',
        'Last 6 Months',
        'Last Year',
        'All',
      ],
      datePeriod: 'Last Week',
      datePickerVisible: false,
      dateToPickerVisible: false,
      dateFrom: null,
      dateTo: null,
      sameDate: true,
      payee: null,
      results: [],
    }
  },

  created() {
  },
  mounted() {
    // the defaults
    this.selectDatePeriod('Last Week')
  },

  methods: {
    handleEnter(e) {
      if (e.keyCode === 13) {
        // handle Enter
        this.search()
      }
    },
    onDatePeriodChanged(period) {
      this.selectDatePeriod(period)
    },
    onDateSelected(value, reason) {
      // console.log(value, reason)
      if (reason !== 'day' && reason !== 'today') return
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
    onDateToSelected(value, reason) {
      if (reason !== 'day' && reason !== 'today') return
      this.$refs.qDateToProxy.hide()
    },
    async search() {
      // run the search
      //this.$q.notify({ message: message, color: "primary" }) // green
      //this.$q.notify({ message: message, color: "secondary" }) // red

      if (!this.freeText && !this.dateFrom && !this.dateTo && !this.payee) {
        this.$q.notify({
          message: 'No search parameters entered/selected!',
          color: 'secondary',
        })
        return
      }

      let searchParams = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        payee: this.payee,
        freeText: this.freeText,
      }

      const serverUrl = await settings.get(SettingKeys.syncServerUrl)
      if (!serverUrl) throw 'Sync Server URL is not set!'

      const sync = new CashierSync(serverUrl)
      let searchResults = null
      try {
        searchResults = await sync.search(searchParams)
      } catch (error) {
        //console.log(error)
        this.$q.notify({ message: error.message, color: 'secondary' })
      }

      searchResults = this.parseResults(searchResults)

      this.results = searchResults
    },
    parseResults(searchResults) {
      if (!searchResults || searchResults.length === 0) return null

      // Massage the data
      let rows = []

      // Create tx records.
      let tx = null
      for (var i = 0; i < searchResults.length; i++) {
        const result_row = searchResults[i]

        // is this the main tx record?
        if (result_row.date) {
          if (tx) {
            // Complete the existing transaction.
            rows.push(tx)
          }
          // start a new transaction.
          tx = {}
          tx.postings = []

          let header = {}
          // yes, create a header record
          header.date = result_row.date
          header.payee = result_row.payee

          tx.header = header
        }

        // add the account row
        let posting = {}
        posting.account = result_row.account
        posting.amount = result_row.amount
        posting.currency = result_row.currency
        tx.postings.push(posting)
      }
      // Append the last transaction
      if (tx.header) {
        rows.push(tx)
      }

      // append artificial ids
      let index = 0
      rows.forEach((item) => (item.id = index++))

      return rows
    },
    selectDatePeriod(period) {
      let today = new Date()
      let tomorrow = addToDate(today, { days: 1 })

      // the default values are from today to tomorrow.
      let startDate = today
      // The end value is not inclusive.
      let endDate = tomorrow

      switch (period) {
        case 'Today':
          //startDate = today
          //endDate = today
          break

        case 'Last Week':
          startDate = subtractFromDate(today, { days: 7 })
          //endDate = today
          break

        case 'Last Month':
          startDate = subtractFromDate(today, { month: 1 })
          //endDate = today
          break

        case 'Last Quarter':
          startDate = subtractFromDate(today, { month: 3 })
          //endDate = today
          break

        case 'Last 6 Months':
          startDate = subtractFromDate(today, { month: 6 })
          break

        case 'Last Year':
          startDate = subtractFromDate(today, { year: 1 })
          //endDate = today
          break

        case 'All':
          startDate = null
          this.dateFrom = null
          //endDate = today
          break
      }

      if (startDate) this.dateFrom = startDate.toJSON().slice(0, 10)
      if (endDate) this.dateTo = endDate.toJSON().slice(0, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
.txrow {
  border-top: 1px solid $secondary;
}
</style>
