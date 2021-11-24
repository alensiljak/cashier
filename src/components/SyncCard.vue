<template>
  <q-card dark bordered class="my-card">
    <!-- header -->
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="sync-alt" class="q-mr-sm" />
      <strong>CashierSync</strong>
      <span class="float-right">
        <font-awesome-icon
          icon="question-circle"
          transform="grow-9 "
          @click="onHelpClick"
        />
      </span>
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
          <!-- image used for CashierSync server detection -->
          <q-img
            v-if="serverUrl"
            v-show="false"
            :src="testUrl"
            @error="onStatusError"
            @load="onStatusSuccess"
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
          <q-card dark class="bg-primary text-amber-2">
            <q-card-section class="row items-center">
              <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>-->
              Live Mode uses CashierSync as the data source for additional 'live' features.
              CashierSync must be running for this to work.
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

    <!-- <q-separator dark /> -->

    <q-card-actions align="center">
      <!-- <q-btn flat dark color="primary" text-color="accent" @click="onSyncClick">
        Sync
      </q-btn> -->
      <q-btn
        outline
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
      liveModeHelpVisible: false,
      serverStatus: false,
      serverUrl: null,
    }
  },

  computed: {
    liveModeOn: {
      get() {
        return this.$store.getters.liveModeOn
      },
      set(value) {
        this.$store.commit(SET_LEDGER_USE, value)
      },
    },
    testUrl: {
      get() {
        const url = this.serverUrl + '/hello?' + Date.now()
        // console.debug('fettching test url', url)
        return url
      },
    },
  },

  created() {
    // Load the CashierSync server url.
    settings.get(SettingKeys.syncServerUrl).then((value) => {
      this.serverUrl = value
      // console.debug('server url loaded')
    })
  },
  async mounted() {
    // turn on Live Mode if the server is up.
    //this.liveModeOn = this.serverStatus
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
    },
    async liveModeTest(showMessages = true) {
      // check if cashier sync is running
      let sync = new CashierSync(this.serverUrl)

      const currentState = this.liveModeOn

      let value = null
      try {
        value = await sync.healthCheck()
        value = JSON.parse(value)
      } catch (reason) {
        // reset the live mode
        if (currentState === true) {
          this.liveModeOn = false
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
    onStatusError(e) {
      // could not reach the server hello image
      // console.debug('CashierSync offline', e)

      this.serverStatus = false
    },
    onStatusSuccess() {
      // console.debug('CashierSync online')

      this.serverStatus = true
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
