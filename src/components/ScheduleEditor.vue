<template>
  <div>
    <p>Repeats</p>
    <div>
      <ul>
        <li>Never (null)</li>
        <li>Every 'count' 'periods'</li>
      </ul>

      <q-input
        v-model="schedule.count"
        type="number"
        label="Count"
        dark
        input-class="text-center"
        @change="onDataChanged"
      />
      <q-select
        v-model="schedule.period"
        :options="periods"
        label="Periods"
        dark
        @input="onDataChanged"
      />
    </div>

    <div>End on 'endDate'; never (null)</div>
    <q-input
      v-model="schedule.endDate"
      label="End date"
      dark
      @click="datePickerVisible = true"
      @change="onDataChanged"
    />
    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-date
        ref="datePicker"
        v-model="schedule.endDate"
        dark
        first-day-of-week="1"
        today-btn
        mask="YYYY-MM-DD"
        @input="onDateSelected"
      >
        <div class="row items-center justify-end q-gutter-sm">
          <!-- <q-btn v-close-popup label="Cancel" color="primary" flat /> -->
          <q-btn v-close-popup label="OK" color="accent" flat />
        </div>
      </q-date>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      schedule: {
        count: null,
        period: null,
        endDate: null,
      },
      periods: [],
      datePickerVisible: false,
    }
  },

  created() {
    this.createPeriods()
    this.schedule = this.value
  },

  methods: {
    createPeriods() {
      this.periods = ['days', 'weeks', 'months', 'years']
    },
    onDataChanged() {
      this.$emit('input', this.schedule)
    },
    onDateSelected(value, reason) {
      if (reason !== 'day' && reason !== 'today') return

      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
  },
}
</script>