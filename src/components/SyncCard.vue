<template>
  <q-card dark bordered class="my-card">
    <q-card-section class="bg-primary q-pa-sm">
      <strong>CashierSync</strong>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col">
          Status:
          <span v-if="serverStatus === true">
            <font-awesome-icon icon="check" class="on" /> Running
          </span>
          <span v-if="serverStatus === false">
            <font-awesome-icon icon="skull" class="off" /> Not running
          </span>
        </div>

        <div class="col">
          <font-awesome-icon
            icon="question-circle"
            transform="grow-9 "
            @click="onHelpClick"
          />
        </div>
        <div class="col text-right">
          <label class="q-mr-sm">Live Mode:</label>
          <q-toggle v-model="liveModeOn" @input="liveModeToggle" />
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
                color="accent"
                @click="liveModeHelpVisible = false"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card-section>

    <q-separator dark />

    <q-card-actions align="right">
      <!-- <q-btn flat dark color="primary" text-color="accent" @click="onSyncClick">
        Sync
      </q-btn> -->
      <q-btn
        flat
        dark
        color="primary"
        text-color="accent"
        @click="onSettingsClick"
      >
        Sync Settings
      </q-btn>
      <!-- <q-btn
        flat
        dark
        color="primary"
        text-color="accent"
        @click="onShutdownClick"
      >
        Shutdown Server
      </q-btn> -->
    </q-card-actions>
  </q-card>
</template>

<script>
import { SET_LEDGER_USE } from '../mutations'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings } from '../lib/Configuration'

export default {
  data() {
    return {
      //liveModeOn: false,
      liveModeHelpVisible: false,
      serverStatus: false,
    }
  },

  computed: {
    liveModeOn: {
      get() {
        return this.$store.state.useLedger
      },
      set(value) {
        this.$store.commit(SET_LEDGER_USE, value)
      },
    },
  },

  created() {
    //this.liveModeOn = this.$store.state.useLedger
  },
  async mounted() {
    // turn on Live Mode if the server is up.
    this.serverStatus = await this.liveModeTest(false)
    if (this.serverStatus) {
      this.liveModeOn = true
    }
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
    async liveModeTest(showMessages = true) {
      // check if cashier sync is running
      const serverUrl = await settings.get(SettingKeys.syncServerUrl)
      let sync = new CashierSync(serverUrl)

      const currentState = this.$store.getters.liveModeOn

      let value = null
      try {
        value = await sync.healthCheck()
      } catch (reason) {
        // this.$q.notify({
        //   message: 'Error: ' + reason,
        //   color: 'secondary',
        // })
        // reset the setting
        if (currentState === true) {
          this.$store.commit(SET_LEDGER_USE, false)
        }
      }

      const result = value === 'Hello World!'

      // Show notification?
      if (showMessages) {
        if (result) {
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
      }

      return result
    },
    onSettingsClick() {
      this.$router.push({ name: 'sync' })
    },
    onShutdownClick() {
      this.$q.notify({ message: 'not implemented', color: 'secondary' })
    },
    onSyncClick() {
      this.$q.notify({ message: 'not implemented', color: 'secondary' })
    },
  },
}
</script>

<style lang="sass" scoped>
.on
  color: $positive

.off
  color: $negative
</style>