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
        />
      </div>
      <div class="col">
        <q-select
          v-model="scheduledTx.period"
          :options="periods"
          label="Periods"
          dark
        />
      </div>
    </div>

    <div class="q-pt-md">
      End on
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

    <div class="q-pt-md">
      Remarks
      <q-input v-model="scheduledTx.remarks" type="textarea" dark />
    </div>
  </div>
</template>

<script>
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
        // return this.scheduledTx.repetition
        return this.scheduledTx.count != null || this.scheduledTx.period != null
      },
      set(value) {
        //this.$set(this.scheduledTx, 'repetition', value)
        //this.scheduledTx.repetition = value
        if (value) {
          this.scheduledTx.period = 'days'
        } else {
          this.scheduledTx.count = null
          this.scheduledTx.period = null
        }
      },
    },
    endOn: {
      get() {
        // return this.scheduledTx.endOn
        return this.scheduledTx.endDate != null
      },
      set(value) {
        //this.$set(this.scheduledTx, 'endOn', value)
        //this.scheduledTx.endOn = value
        if (value) {
          this.scheduledTx.endDate = ''
        } else {
          this.scheduledTx.endDate = null
        }
      },
    },
  },

  created() {
    this.createPeriods()
  },

  methods: {
    createPeriods() {
      this.periods = ['days', 'weeks', 'months', 'end of month', 'years']
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
