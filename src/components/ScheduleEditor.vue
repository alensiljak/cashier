<template>
  <div>
    <div>Repeats</div>
    <q-option-group
      v-model="repetition"
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
          input-class="text-center"
          class="q-mr-md"
        />
      </div>
      <div class="col">
        <q-select
          v-model="scheduledTx.period"
          :options="periods"
          label="Periods"
        />
      </div>
    </div>

    <div class="q-pt-md">
      End on
      <q-option-group
        v-model="endOn"
        :options="endOptions"
        label="End on"
        type="radio"
      />
      <div v-show="endOn" class="q-pl-xl">
        <q-input
          v-model="scheduledTx.endDate"
          label="End date"
          @click="datePickerVisible = true"
        />
        <q-dialog ref="qDateProxy" v-model="datePickerVisible">
          <q-date
            ref="datePicker"
            v-model="scheduledTx.endDate"
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
      <q-input v-model="scheduledTx.remarks" type="textarea" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref, ref } from 'vue'

// const scheduledTx = inject('scheduledTx', {})

// data

const periods: Ref<string[]> = ref([])

createPeriods()

function createPeriods() {
  periods.value = [
    'days',
    'weeks',
    'months',
    'start of month',
    'end of month',
    'years',
  ]
}

//
</script>
<script lang="ts">
export default {
  inject: ['scheduledTx'],

  data() {
    return {
      datePickerVisible: false,
      repeatOptions: [
        { label: 'Never', value: false },
        { label: 'Every ...', value: true },
      ],
      endOptions: [
        { label: 'Never', value: false },
        { label: 'On', value: true },
      ],
    }
  },

  computed: {
    repetition: {
      get() {
        if (!this.scheduledTx) return null

        return this.scheduledTx.count != null || this.scheduledTx.period != null
      },
      set(value) {
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
        return this.scheduledTx.endDate != null
      },
      set(value) {
        if (value) {
          this.scheduledTx.endDate = ''
        } else {
          this.scheduledTx.endDate = null
        }
      },
    },
  },

  methods: {
    onDateSelected(value, reason) {
      if (reason !== 'day' && reason !== 'today') return

      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
  },
}
</script>
