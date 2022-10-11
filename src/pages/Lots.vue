<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'Lots'" />

    <div>Lots for {{ symbol }}</div>
    <ul>
      <li v-for="lot in lots" :key="lot">{{ lot }}</li>
    </ul>
  </q-page>
</template>

<script lang="ts">
import Toolbar from '../components/CashierToolbar.vue'
import { CashierSync } from '../lib/syncCashier'
import { SettingKeys, settings } from '../lib/settings'

export default {
  components: {
    Toolbar,
  },
  data() {
    return {
      symbol: null,
      lots: [],
      serverUrl: null,
    }
  },
  created() {
    this.symbol = this.$route.params.symbol
    settings
      .get(SettingKeys.syncServerUrl)
      .then((value) => (this.serverUrl = value))
      .then(() => this.loadData())
  },

  methods: {
    /**
     * Load lots for the symbol
     */
    async loadData() {
      const sync = new CashierSync(this.serverUrl)
      const lots = await sync.readLots(this.symbol)
      this.lots = lots
    },
  },
}
</script>
