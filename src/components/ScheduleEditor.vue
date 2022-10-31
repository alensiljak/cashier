<template>
  <div>
    <div>Repeats</div>
    <q-option-group v-model="repetition" :options="repeatOptions" label="Repeats" type="radio" />
    <div v-show="repetition === true" class="row q-pl-xl">
      <div class="col">
        <q-input v-model="scheduledTx.count" type="number" label="Count" input-class="text-center" class="q-mr-md" />
      </div>
      <div class="col">
        <q-select v-model="scheduledTx.period" :options="periods" label="Periods" />
      </div>
    </div>

    <div class="q-pt-md">
      End on
      <q-option-group v-model="endOn" :options="endOptions" label="End on" type="radio" />
      <div v-show="endOn" class="q-pl-xl">
        <q-input v-model="scheduledTx.endDate" label="End date" @click="datePickerVisible = true" />
        <q-dialog ref="qDateProxy" v-model="datePickerVisible" v-close-popup="closeDateDialog">
          <q-date ref="datePicker" v-model="scheduledTx.endDate" first-day-of-week="1" today-btn mask="YYYY-MM-DD"
            @input="onDateSelected">
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
import { computed, inject, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'
import { ScheduledTransaction } from 'src/model';

const $q = useQuasar()

const scheduledTx: ScheduledTransaction = inject('scheduledTx', new ScheduledTransaction())

// computed
const repetition = computed({
  get() {
    if (!scheduledTx) return null

    return scheduledTx.count != null || scheduledTx.period != null
  },
  set(value) {
    if (value) {
      scheduledTx.period = 'days'
    } else {
      scheduledTx.count = null
      scheduledTx.period = null
    }
  },
})

const endOn = computed({
  get() {
    return scheduledTx.endDate != null
  },
  set(value) {
    if (value) {
      scheduledTx.endDate = ''
    } else {
      scheduledTx.endDate = null
    }
  },
})


// data

const periods: Ref<string[]> = ref([])
const datePickerVisible = ref(false)
const closeDateDialog = ref(false)

const repeatOptions = ref([
  { label: 'Never', value: false },
  { label: 'Every ...', value: true },
])
const endOptions = ([
  { label: 'Never', value: false },
  { label: 'On', value: true },
])

// onCreate

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

function onDateSelected(value: any, reason: any) {
  if (reason !== 'day' && reason !== 'today') return

  // close the picker if the date was selected
  //$q.refs.qDateProxy.hide()
  closeDateDialog.value = true
  // the date is saved on close.
}


</script>
