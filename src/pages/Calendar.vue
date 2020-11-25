<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Calendar" />

    <div class="q-pt-md row">
      <q-date
        v-model="date"
        mask="YYYY-MM-DD"
        first-day-of-week="1"
        dark
        :events="events"
        class="col q-mx-lg"
        @input="onDateChanged"
      />
    </div>

    <q-separator dark class="q-my-lg" />

    <div>
      <p>Events on the selected day - {{ date }}</p>
      <q-list dark>
        <q-item v-for="(event, index) in todaysEvents" :key="index">
          {{ event }}
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>
<script>
import Toolbar from '../components/Toolbar'
import { Projector } from '../lib/scheduledTransactions'
import moment from 'moment'
import appService from '../appService'

export default {
  components: {
    Toolbar,
  },

  data() {
    return {
      date: '2020-11-01',
      projections: [],
    }
  },

  computed: {
    events: {
      get() {
        // get only the date values from the projections
        return this.projections.map(item => item.date.replaceAll('-', '/'))
      }
    },
    todaysEvents: {
      get() {
        return this.projections.filter(item => item.date === this.date)
          .map(item => item.payee)
      }
    }
  },

  mounted() {
    this.generateData().then(() => {
      console.log('done')
    })
  },

  methods: {
    async generateData() {
      // generate projections for the given month
      const dateFormat = 'YYYY-MM-DD'
      let startDate = moment(this.date).startOf('month').format(dateFormat)
      let endDate = moment(this.date).endOf('month').format(dateFormat)

      let schedules = await appService.db.scheduled
        .orderBy('nextDate')
        .toArray()

      // console.info(
      //   'calculating projections for the period',
      //   startDate.format(dateFormat),
      //   endDate.format(dateFormat),
      //   schedules
      // )

      var projector = new Projector(schedules)
      this.projections = projector.project(startDate, endDate)
    },
    onDateChanged() {
      // todo Show events on the given date
      // just filter the event list

      // handle the case when the month has changed

    },
  },
}
</script>
