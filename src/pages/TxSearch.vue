<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- date -->
    <q-select v-model="datePeriod" :options="datePeriods" label="Date Period" dark
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
          <q-btn v-close-popup label="OK" flat color="secondary" text-color="accent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-input v-model="dateFrom" label="Date From" dark @click="datePickerVisible = true">
      <template v-slot:prepend>
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
          <q-btn v-close-popup label="OK" flat color="secondary" text-color="accent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-9">
        <q-input v-model="dateTo" label="Date To" dark @click="dateToPickerVisible = true">
          <template v-slot:prepend>
            <font-awesome-icon icon="calendar-day" />
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-checkbox v-model="sameDate" label="Same as From" />
      </div>
    </div>

    <!-- payee -->
    <!-- <q-input v-model="payee" label="Payee" dark>
      <template v-slot:prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input> -->

    <q-input v-model="freeText" label="Free-text search" dark @keypress="handleEnter" />

    <!-- search button -->
    <div class="text-center q-my-lg">
      <q-btn color="secondary" text-color="accent" @click="search">
        <font-awesome-icon icon="search" transform="grow-6 right-6" class="q-mr-sm" />
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
    <div id="resultsPanel">
      <pre>{{ results }}</pre>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import { settings, SettingKeys } from 'src/lib/Configuration';
import { CashierSync } from "../lib/syncCashier";
import { date } from 'quasar'
const { subtractFromDate } = date

export default {
    data() {
      return {
        freeText: null,
        datePeriods: ['Today', 'Last Week', 'Last Month', 'Last Quarter', 'Last Year'],
        datePeriod: 'Last Week',
        datePickerVisible: false,
        dateToPickerVisible: false,
        dateFrom: null,
        dateTo: null,
        sameDate: true,
        payee: null,
        results: null
      }
    },

  created() {
    this.$store.commit(SET_TITLE, "Transaction Search");
    this.$store.commit(MAIN_TOOLBAR, true);

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
      if (reason !== "day" && reason !== "today") return;
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide();
      // the date is saved on close.
    },
    onDateToSelected(value, reason) {
      if (reason !== "day" && reason !== "today") return;
      this.$refs.qDateToProxy.hide();
    },
    search() {
        // run the search
        //const message = "Not implemented yet"
        //this.$q.notify({ message: message, color: "primary" }) // green
        //this.$q.notify({ message: message, color: "secondary" }) // red
        if(!this.freeText && !this.dateFrom && !this.dateTo) {
          this.$q.notify({ message: "No search parameters selected", color: "secondary" })
          return
        }

        let searchParams = {
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          freeText: this.freeText
        }

        settings.get(SettingKeys.syncServerUrl)
          .then(serverUrl => {
            if (!serverUrl) throw "Sync Server URL is not set!"

            const sync = new CashierSync(serverUrl);
            return sync.search(searchParams)
          })
          .then(result => this.results = result)
          .catch(error => this.$q.notify({ message: error, color: "secondary" }))
    },
    selectDatePeriod(period) {
      let today = new Date()

      //const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
      // let startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
      //let startDate = dateTimeFormat.format(today)
      let startDate = today
      let endDate = today

      switch(period) {
        case 'Today':
          startDate = today
          endDate = today
          break;

        case 'Last Week':
          startDate = subtractFromDate(today, { days: 7 })
          endDate = today
          break;

        case 'Last Month':
          startDate = subtractFromDate(today, { month: 1 })
          endDate = today
          break;

        case 'Last Quarter':
          startDate = subtractFromDate(today, { month: 3 })
          endDate = today
          break;

        case 'Last Year':
          startDate = subtractFromDate(today, { year: 1 })
          endDate = today
          break;
      }
      this.dateFrom = startDate.toJSON().slice(0, 10)
      this.dateTo = endDate.toJSON().slice(0, 10)

    }
  }
}
</script>

<style>
#resultsPanel {
  /* overflow: overflow-x; */
  overflow-x: auto;
  width: 100%;
}
</style>
