<template>
  <q-page padding class="bg-colour1 text-colour2">
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
    <!-- <div class="row"> -->
    <!-- <div class="col-9"> -->
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
    <!-- </div> -->
    <!-- <div class="col">
        <q-checkbox v-model="sameDate" label="Same as From" />
      </div> -->
    <!-- </div> -->

    <!-- payee -->
    <!-- <q-input v-model="payee" label="Payee" dark>
      <template v-slot:prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input> -->

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
    <!-- <q-input
      v-model="results"
      type="textarea"
      autogrow
      filled
      style="width: 100%; max-height: 90%"
      input-class="text-amber-2"
      color="primary"
    /> -->
    <!-- <div id="resultsPanel">
      <pre>{{ results }}</pre>
    </div> -->
    <!-- <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="results"
      :item-size="15"
      key-field="id"
    >
      <div v-if="item.payee" class="scroller-item">
        <span class="q-mr-md">{{ item.date }}</span>
        {{ item.payee }}
      </div>
      <div v-if="!item.payee" class="scroller-item row">
        <div class="col q-ml-md">{{ item.account }}</div>
        <div class="text-right">{{ item.amount }} {{ item.currency }}</div>
      </div>
    </RecycleScroller> -->

    <div v-for="item in results" :key="item.id">
      <div v-if="item.payee" class="txrow">
        <span class="q-mr-sm">{{ item.date }}</span>
        {{ item.payee }}
      </div>
      <div v-if="!item.payee" class="scroller-item row">
        <div class="col q-ml-md">{{ item.account }}</div>
        <div class="text-right">{{ item.amount }} {{ item.currency }}</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from '../mutations'
import { settings, SettingKeys } from 'src/lib/Configuration'
import { CashierSync } from '../lib/syncCashier'
import { date } from 'quasar'
const { subtractFromDate, addToDate } = date
import { RecycleScroller } from 'vue-virtual-scroller'

import Vue from 'vue'
Vue.component('RecycleScroller', RecycleScroller)

export default {
  data() {
    return {
      freeText: null,
      datePeriods: [
        'Today',
        'Last Week',
        'Last Month',
        'Last Quarter',
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
    this.$store.commit(SET_TITLE, 'Transaction Search')
    this.$store.commit(MAIN_TOOLBAR, true)

    //this.loadSettings();
  },
  mounted() {
    // the defaults
    this.selectDatePeriod('Last Week')
  },

  methods: {
    handleEnter(e) {
      //
      //console.log(e)
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
      if (!this.freeText && !this.dateFrom && !this.dateTo) {
        this.$q.notify({
          message: 'No search parameters selected',
          color: 'secondary',
        })
        return
      }

      let searchParams = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        freeText: this.freeText,
      }

      const serverUrl = await settings.get(SettingKeys.syncServerUrl)
      if (!serverUrl) throw 'Sync Server URL is not set!'

      const sync = new CashierSync(serverUrl)
      let searchResults = null
      try {
        searchResults = await sync.search(searchParams)
      } catch (error) {
        console.log(error)
        this.$q.notify({ message: error.message, color: 'secondary' })
      }

      searchResults = this.adjustResults(searchResults)

      this.results = searchResults
    },
    adjustResults(searchResults) {
      // Massage the data
      let rows = []

      // Create separate rows for date/payee, and postings
      for(var i = 0; i < searchResults.length; i++) {
        const result_row = searchResults[i]
        let new_row = {}
        // is this the main tx record?
        if(result_row.date) {
          // yes, create a header record
          new_row.date = result_row.date
          new_row.payee = result_row.payee
          
          rows.push(new_row)
        }

        // add the account row
        new_row = {}
        new_row.account = result_row.account
        new_row.amount = result_row.amount
        new_row.currency = result_row.currency
        rows.push(new_row)
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
// #resultsPanel {
//   /* overflow: overflow-x; */
//   overflow-x: auto;
//   width: 100%;
// }
// .scroller {
//   height: 40rem;
//   overflow-x: auto;
//   border: 1px solid $primary;
// }
// .scroller-item {
//   height: 15%;
//   //height: 1rem;
//   padding: 0 6px;
//   display: flex;
//   align-items: top;
// }
.txrow {
  border-top: 1px solid $secondary;
}
</style>
