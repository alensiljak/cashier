view<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>
      This will execute Ledger Xact command, creating a matching transaction.
    </p>

    <!-- date -->
    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-card dark>
        <q-card-section class="q-pa-none">
          <q-date
            ref="datePicker"
            v-model="date"
            dark
            first-day-of-week="1"
            today-btn
            mask="YYYY-MM-DD"
            @input="onDateSelected"
          />
        </q-card-section>
        <q-separator dark />
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="OK"
            flat
            color="secondary"
            text-color="accent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-input v-model="date" label="Date" dark @click="datePickerVisible = true">
      <template #prepend>
        <font-awesome-icon icon="calendar-day" />
      </template>
    </q-input>

    <q-input v-model="payee" label="Payee" dark />

    <q-input
      v-model="freeText"
      label="Free-text search"
      dark
      @keypress="handleEnter"
    />

    <!-- action button -->
    <div class="text-center q-my-lg">
      <q-btn color="secondary" text-color="accent" @click="run">
        <font-awesome-icon
          icon="search"
          transform="grow-6 right-6"
          class="q-mr-sm"
        />
        <span class="q-ml-sm">Xact</span>
      </q-btn>
    </div>

    <div>
      <pre>{{ results }}</pre>
    </div>

    <!-- "Use" button -->
    <div v-if="results" class="text-center">
      <q-btn
        color="secondary"
        text-color="accent"
        label="Use"
        @click="useResult"
      />
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from '../mutations'
import { settings, SettingKeys } from 'src/lib/Configuration'
import { CashierSync } from '../lib/syncCashier'
import { XactParser } from '../lib/XactParser'
import appService from '../appService'

export default {
  data() {
    return {
      date: null,
      payee: null,
      datePickerVisible: false,
      freeText: null,
      results: null,
    }
  },

  created() {
    this.$store.commit(SET_TITLE, 'Xact')
    this.$store.commit(MAIN_TOOLBAR, true)
  },

  mounted() {
    // load any parameters
    this.readParameters()
  },

  methods: {
    getSearchParameters() {
      let searchParams = {}
      if (this.date) {
        searchParams.date = this.date
      }
      if (this.payee) {
        searchParams.payee = this.payee
      }
      if (this.freeText) {
        searchParams.freeText = this.freeText
      }
      return searchParams
    },
    async handleEnter(e) {
      //
      //console.log(e)
      if (e.keyCode === 13) {
        // handle Enter
        await this.run()
      }
    },
    onDateSelected(value, reason) {
      // console.log(value, reason)
      if (reason !== 'day' && reason !== 'today') return
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()
      // the date is saved on close.
    },
    async run() {
      // run xact

      const searchParams = this.getSearchParameters()

      try {
        const serverUrl = await settings.get(SettingKeys.syncServerUrl)
        if (!serverUrl) throw 'Sync Server URL is not set!'

        const sync = new CashierSync(serverUrl)
        // todo: new method
        const result = await sync.xact(searchParams)
        this.results = result
      } catch (error) {
        this.$q.notify({ message: error, color: 'secondary' })
      }
    },
    async readParameters() {
      const payee = this.$route.params.payee
      if (payee) {
        this.payee = payee
        await this.run()
      }
    },
    /**
     * Parse the result and use as the current Transaction.
     */
    async useResult() {
      // parse the Xact results
      const parser = new XactParser()
      const tx = parser.parse(this.results)

      // save transaction
      const tx_id = await appService.saveTransaction(tx)

      // open for editing?
      this.$router.push({ name: 'edittx', params: { id: tx_id } })
    },
  },
}
</script>