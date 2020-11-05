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
            <q-btn v-close-popup label="OK" color="accent" flat />
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

    <!-- payee -->
    <q-input v-model="tx.payee" label="Payee" dark @click.once="onPayeeClick">
      <template #prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>
  </div>
</template>
<script>
import appService from '../appService'
import { SET_TRANSACTION, SET_SELECT_MODE } from '../mutations'
import { CurrentTransactionService } from '../lib/currentTransactionService'
import { SelectionModeMetadata } from '../lib/Configuration'

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
          tx = this.resetTransaction()
        }
        return tx
      },
      set(value) {
        // save in the state store
        this.$store.commit(SET_TRANSACTION, value)
      },
    },
  },

  created() {
    // are we back from the select mode?
    if (this.$store.getters.selectionModeMeta) {
      this.handleSelection()
    }
  },

  methods: {
    /**
     * Handle selection after a picker returned.
     */
    async handleSelection() {
      // todo handle blank id if the user presses 'back'.
      const select = this.$store.state.selectModeMeta
      const id = select.selectedId

      switch (select.selectionType) {
        case 'payee':
          this.tx.payee = id
          break
        case 'account':
          // get the posting
          var index = null
          if (typeof select.postingIndex === 'number') {
            index = select.postingIndex
          } else {
            // redirected from account register, find an appropriate posting
            index = this.getEmptyPostingIndex()
          }
          var posting = this.tx.postings[index]

          const account = await appService.db.accounts.get(id)
          posting.account = account.name
          posting.currency = account.currency
          break
      }

      // clean-up, reset the selection values
      this.$store.commit(SET_SELECT_MODE, null)
    },
    /**
     * (value, reason, details)
     */
    onDateSelected(value, reason) {
      if (reason !== 'day' && reason !== 'today') return

      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
    onPayeeClick() {
      const selectMode = new SelectionModeMetadata()

      // set the type
      selectMode.selectionType = 'payee'

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode)
      // show account picker
      this.$router.push({ name: 'payees' })
    },
    resetTransaction() {
      const tx = new CurrentTransactionService(this.$store).createTransaction()
      this.tx = tx
      return tx
    },
  },
}
</script>