<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar :title="'New Transaction'" />

    <!-- Transaction -->

    <!-- date -->
    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-date
        ref="datePicker"
        v-model="tx.date"
        dark
        first-day-of-week="1"
        today-btn
        mask="YYYY-MM-DD"
        @input="onDateSelected"
      />
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

    <!-- payee -->
    <q-input v-model="tx.payee" label="Payee" dark @click="onPayeeClick">
      <template #prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>

    <div v-if="$store.state.useLedger" class="text-center">
      <q-btn
        label="xact"
        color="secondary"
        text-color="accent"
        @click="onXactClicked"
      />
    </div>

    <!--note -->
    <q-input v-model="tx.note" label="Note" dark>
      <template #prepend>
        <font-awesome-icon icon="file-alt" />
      </template>
    </q-input>

    <div class="form-row q-mt-sm">
      <div class="col">Postings</div>
    </div>

    <!-- Postings -->
    <q-slide-item
      v-for="(posting, index) in tx.postings"
      :key="index"
      dark
      right-color="red-10"
      @right="onSlide"
    >
      <template #right>
        <div
          class="row items-center text-amber-4"
          @click="deletePosting(index)"
        >
          Click to confirm or wait 2s to cancel
          <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
        </div>
      </template>
      <q-item dark class="bg-colour1">
        <q-item-section>
          <QPosting
            :posting="posting"
            :index="index"
            @delete-row="deletePosting"
            @account-clicked="onAccountClicked(index)"
            @amount-changed="onAmountChanged"
          />
        </q-item-section>
      </q-item>
    </q-slide-item>

    <!-- Sum -->
    <q-item dark>
      <q-item-section>
        <q-item-label>Sum</q-item-label>
      </q-item-section>
      <q-item-section avatar>{{ formatNumber(postingSum) }}</q-item-section>
    </q-item>

    <!-- posting actions -->
    <div class="row q-mt-sm">
      <div class="col text-center">
        <q-btn
          color="primary"
          text-color="accent"
          size="small"
          @click="addPosting"
        >
          <font-awesome-icon
            icon="plus-circle"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          <div>Add Posting</div>
        </q-btn>
      </div>
    </div>

    <!-- main (tx) Actions -->
    <div class="row q-my-xl justify-end">
      <div class="col text-center">
        <q-btn
          color="secondary"
          text-color="accent"
          size="medium"
          @click="onClear"
        >
          <font-awesome-icon
            icon="times-circle"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          <div>Reset</div>
        </q-btn>
      </div>
      <div class="col text-center">
        <q-btn
          class="q-px-lg"
          color="accent"
          text-color="secondary"
          label="Save"
          size="medium"
          @click="onSave"
        >
          <font-awesome-icon
            icon="save"
            transform="grow-9"
            class="q-icon-small on-right"
          />
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import QPosting from '../components/Posting.vue'
import { Posting } from '../model'
import {
  SET_TRANSACTION,
  SET_SELECT_MODE,
} from '../mutations'
import appService from '../appService'
import { SelectionModeMetadata } from '../lib/Configuration'
import Toolbar from '../components/Toolbar'

const ACCOUNT = 'account'

export default {
  components: {
    QPosting,
    Toolbar,
  },
  data() {
    return {
      datePickerVisible: false,
      resetSlide: null,
      postingSum: 0,
      liveModeOn: false,
    }
  },

  computed: {
    tx: {
      get() {
        let tx = this.$store.state.transaction
        if (tx === null) {
          tx = this.resetTransaction()
        }
        return tx
      },
      set(value) {
        // todo save in the state store
        this.$store.commit(SET_TRANSACTION, value)
      },
    },
  },

  created() {
    this.loadData()

    // are we back from the select mode?
    if (this.$store.state.selectModeMeta) this.handleSelection()
  },
  mounted: function () {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    // this.$refs.date
    // this.date = new Date().toISOString().substring(0, 10);

    this.recalculateSum()
  },

  methods: {
    addPosting() {
      // this.$store.dispatch(ADD_POSTING);
      this.tx.postings.push(new Posting())
    },
    deletePosting(index) {
      if (this.resetSlide) {
        // remove the slide section.
        this.resetSlide()
        this.resetSlide = null
      }

      this.tx.postings.splice(index, 1)

      this.recalculateSum()
    },
    echo(message) {
      this.$q.notify(message)
    },
    formatNumber(value) {
      return appService.formatNumber(value)
    },
    /**
     * Find an empty posting, or create one.
     */
    getEmptyPostingIndex() {
      for (let i = 0; i < this.tx.postings.length; i++) {
        const posting = this.tx.postings[i]
        if (!posting.account && !posting.amount && !posting.commodity) {
          return i
        }
      }

      // not found. Create a new one.
      const posting = new Posting()
      this.tx.postings.push(posting)
      return this.tx.postings.length - 1
    },
    finalize(reset) {
      this.timer = setTimeout(() => {
        // has it been already deleted?
        if (!reset) return

        reset()
      }, 2000)
    },
    /**
     * Handle selection after a picker returned.
     */
    handleSelection() {
      // todo handle blank id if the user presses 'back'.
      const select = this.$store.state.selectModeMeta
      const id = select.selectedId

      switch (select.selectionType) {
        case 'payee':
          this.tx.payee = id
          break
        case ACCOUNT:
          // get the posting
          var index = null
          if (typeof select.postingIndex === 'number') {
            index = select.postingIndex
          } else {
            // redirected from account register, find an appropriate posting
            index = this.getEmptyPostingIndex()
          }
          var posting = this.tx.postings[index]

          appService.db.accounts.get(id).then((account) => {
            posting.account = account.name
            posting.currency = account.currency
          })
          // console.log("account", id);
          break
      }

      // clean-up, reset the selection values
      this.$store.commit(SET_SELECT_MODE, null)
    },
    /**
     * Load all data for the view.
     */
    loadData() {
      // Transaction
      const id = this.$route.params.id
      if (id) {
        this.loadTransaction(id)
      }
    },
    loadTransaction(id) {
      appService.loadTransaction(id).then((tx) => {
        this.tx = tx
      })
    },
    onAccountClicked(index) {
      const selectMode = new SelectionModeMetadata()

      // save the index of the posting being edited
      selectMode.postingIndex = index
      // set the type
      selectMode.selectionType = ACCOUNT
      // set the return route
      // todo: this could also be 'edittx'
      selectMode.originRoute = { name: 'newtx' }

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode)
      // show account picker
      this.$router.push({ name: 'accounts' })
    },
    onAmountChanged() {
      // recalculate the sum
      this.recalculateSum()
    },
    onClear() {
      // Resets all Transaction fields to defaults.
      this.resetTransaction()
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
      // search when min. 2 characters typed
      //if(this.tx.payee.length < 2) return;

      const selectMode = new SelectionModeMetadata()

      // set the type
      selectMode.selectionType = 'payee'
      // set the return route
      // todo: this could also be 'edittx'
      selectMode.originRoute = { name: 'newtx' }

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode)
      // show account picker
      this.$router.push({ name: 'payees' })
    },
    async onSave() {
      try {
        await appService.saveTransaction(this.tx)
        // transaction committed
        // clear Transaction entry
        this.onClear()
        // go to journal?
        this.$router.push({ name: 'journal' })
      } catch (err) {
        console.error(err)
      }
    },
    onSlide({ reset }) {
      this.resetSlide = reset
      this.finalize(reset)
    },
    onXactClicked() {
      this.$router.push({ name: 'xact', params: { payee: this.tx.payee } })
    },
    recalculateSum() {
      this.postingSum = 0

      for (let i = 0; i < this.tx.postings.length; i++) {
        const posting = this.tx.postings[i]
        // console.log(posting)
        this.postingSum += posting.amount
      }
    },
    resetTransaction() {
      const tx = appService.createTransaction()
      this.tx = tx
      return tx
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
</style>
