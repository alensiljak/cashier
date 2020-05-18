<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>Lots for {{symbol}}</div>
    <div>{{lots}}</div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import { CashierSync } from "../lib/syncCashier";
import { SettingKeys, settings } from "../lib/Configuration";

export default {
  data() {
    return {
      symbol: null,
      lots: [],
      serverUrl: null
    };
  },
  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Lots");

    this.symbol = this.$route.params.symbol;
    settings
      .get(SettingKeys.syncServerUrl)
      .then(value => (this.serverUrl = value))
      .then(() => this.loadData(this.symbol));
  },

  methods: {
    /**
     * Load lots for the symbol
     */
    loadData() {
      let sync = new CashierSync(this.serverUrl);
      sync.readLots(this.symbol)
        .then(lots => this.lots = lots)
    }
  }
};
</script>