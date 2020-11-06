<template>
  <div>
    <div>Repeats</div>
    <q-option-group
      v-model="repetition"
      dark
      :options="repeatOptions"
      label="Repeats"
      type="radio"
    />
    <div v-show="repetition === true" class="row q-pl-xl">
      <div class="col">
        <q-input
          v-model="schedule.count"
          type="number"
          label="Count"
          dark
          input-class="text-center"
          class="q-mr-md"
          @change="onDataChanged"
        />
      </div>
      <div class="col">
        <q-select
          v-model="schedule.period"
          :options="periods"
          label="Periods"
          dark
          @input="onDataChanged"
        />
      </div>
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
import { ScheduledTransaction } from '../model'

export default {
  // props: {
  //   value: {
  //     type: Object,
  //     default: null,
  //   },
  // },

  data() {
    return {
      schedule: {
        count: null,
        period: null,
        endDate: null,
      },
      periods: [],
      datePickerVisible: false,
      repeatOptions: [
        { label: 'Never', value: false },
        { label: 'Every ...', value: true },
      ],
      repetition: false,
    }
  },

  computed: {
    scheduledTx: {
      get() {
        let result = this.$store.getters.clipboard
        if (!result) {
          result = new ScheduledTransaction()
        }
        return result
      },
      set(value) {
        this.$store.commit('saveToClipboard', value)
      },
    },
  },

  created() {
    this.createPeriods()
    //this.schedule = this.value
    this.load()
  },

  methods: {
    createPeriods() {
      this.periods = ['days', 'weeks', 'months', 'years']
    },
    load() {
      this.schedule = this.scheduledTx
      this.repetition = (this.scheduledTx.count != null) || (this.scheduledTx.period != null)
    },
    onDataChanged() {
      //this.$emit('input', this.schedule)
      this.scheduledTx = this.schedule
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