<template>
  <div>
    <!-- date -->
    <div id="dateSelector">
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date
          ref="datePicker"
          v-model="tx.date"
          dark
          first-day-of-week="1"
          today-btn
          mask="YYYY-MM-DD"
          @input="onDateSelected"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <!-- <q-btn v-close-popup label="Cancel" color="primary" flat /> -->
            <q-btn
              v-close-popup
              label="OK"
              color="accent"
              flat
            />
          </div>
        </q-date>
      </q-dialog>

      <q-input
        v-model="tx.date"
        label="Date"
        dark
        @click="datePickerVisible = true"
      >
        <template #prepend>
          <font-awesome-icon icon="calendar-day" />
        </template>
      </q-input>
    </div>
  </div>
</template>
<script>
import appService from '../appService'
import { SET_TRANSACTION, SET_SELECT_MODE } from '../mutations'
import { CurrentTransactionService } from '../lib/currentTransactionService'

export default {
  data() {
    return {
      datePickerVisible: false,
    }
  },

  computed: {
    tx: {
      get() {
        let tx = this.$store.getters.transaction
        if (tx === null) {
          this.resetTransaction()
        }
        return tx
      },
      set(value) {
        // save in the state store
        this.$store.commit(SET_TRANSACTION, value)
      },
    },
  },

  methods: {
    /**
     * (value, reason, details)
     */
    onDateSelected(value, reason) {
      if (reason !== 'day' && reason !== 'today') return

      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
    resetTransaction() {
      this.tx = new CurrentTransactionService().createTransaction()
    },
  },
}
</script>