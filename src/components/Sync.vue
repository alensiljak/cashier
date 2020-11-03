<template>
  <div>
    <div class="row"> <!-- absolute-bottom -->
      <div class="col">
        <label class="q-mr-sm">Live Mode:</label>
        <font-awesome-icon
          icon="question-circle"
          transform="grow-9 "
          @click="onHelpClick"
        />
      </div>
      <div class="col text-right">
        <q-toggle v-model="liveModeOn" @input="liveModeToggle" />
      </div>
    </div>

    <!-- help dialog -->
    <q-dialog
      v-model="liveModeHelpVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>-->
          Live Mode uses CashierSync for all the data. CashierSync must be
          running.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="OK"
            color="amber-4"
            @click="liveModeHelpVisible = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { TOGGLE_DRAWER, SET_LEDGER_USE } from '../mutations'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings } from '../lib/Configuration'

export default {
  data() {
    return {
      liveModeOn: false,
      liveModeHelpVisible: false,
    }
  },

  created() {
    this.liveModeOn = this.$store.state.useLedger
  },

  methods: {
    onHelpClick() {
      this.liveModeHelpVisible = true
    },
    async liveModeToggle() {
      this.$store.commit(SET_LEDGER_USE, this.liveModeOn)

      if (this.liveModeOn) {
        await this.liveModeTest()
      }

      //this.$emit('live-mode-on')
    },
    async liveModeTest() {
      // check if cashier sync is running
      const serverUrl = await settings.get(SettingKeys.syncServerUrl)
      let sync = new CashierSync(serverUrl)

      const value = await sync.healthCheck().catch((reason) => {
        this.$q.notify({
          message: 'Error: ' + reason,
          color: 'secondary',
        })
        // reset the setting
        this.liveModeOn = false
      })

      if (value === 'Hello World!') {
        this.$q.notify({
          message: 'The CashierSync server is running.',
          color: 'primary',
        })
      } else {
        this.$q.notify({
          message: 'The CashierSync server is not running.',
          color: 'secondary',
        })
      }
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },
  },
}
</script>