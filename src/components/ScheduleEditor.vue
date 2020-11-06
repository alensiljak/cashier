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
          v-model="scheduledTx.count"
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
          v-model="scheduledTx.period"
          :options="periods"
          label="Periods"
          dark
          @input="onDataChanged"
        />
      </div>
    </div>

    <div>End on</div>
    <q-option-group
      v-model="endOn"
      dark
      :options="endOptions"
      label="End on"
      type="radio"
    />
    <div v-show="endOn" class="q-pl-xl">
      <q-input
        v-model="scheduledTx.endDate"
        label="End date"
        dark
        @click="datePickerVisible = true"
        @change="onDataChanged"
      />
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date
          ref="datePicker"
          v-model="scheduledTx.endDate"
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
  </div>
</template>

<script>
import { ScheduledTransaction } from '../model'

export default {
  data() {
    return {
      periods: [],
      datePickerVisible: false,
      repeatOptions: [
        { label: 'Never', value: false },
        { label: 'Every ...', value: true },
      ],
      //repetition: false,
      endOptions: [
        { label: 'Never', value: false },
        { label: 'On', value: true },
      ],
      // endOn: false,
    }
  },

  computed: {
    scheduledTx: {
      get() {
        let result = this.$store.getters.clipboard
        // if (!result) {
        //   result = new ScheduledTransaction()
        // }
        return result
      },
      set(value) {
        this.$store.commit('saveToClipboard', value)
      },
    },
    repetition: {
      get() {
        return this.scheduledTx.repetition
      },
      set(value) {
        this.$set(this.scheduledTx, 'repetition', value)
        //this.scheduledTx.repetition = value
      },
    },
    endOn: {
      get() {
        return this.scheduledTx.endOn
      },
      set(value) {
        this.$set(this.scheduledTx, 'endOn', value)
        //this.scheduledTx.endOn = value
      },
    },
  },

  created() {
    this.createPeriods()
    //this.schedule = this.value
    if (this.scheduledTx === null) {
      this.scheduledTx = new ScheduledTransaction()
    }

    if (this.scheduledTx) {
      // repetition
      if (this.scheduledTx.repetition === undefined) {
        const repetition =
          this.scheduledTx.count != null || this.scheduledTx.period != null
        this.$set(this.scheduledTx, 'repetition', repetition)
      }
      if (this.scheduledTx.endOn === undefined) {
        const endOn = this.scheduledTx.endDate != null
        this.$set(this.scheduledTx, 'endOn', endOn)
      }
    }
  },

  methods: {
    createPeriods() {
      this.periods = ['days', 'weeks', 'months', 'years']
    },
    onDataChanged() {
      //this.$emit('input', this.schedule)
      //this.scheduledTx = this.schedule
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