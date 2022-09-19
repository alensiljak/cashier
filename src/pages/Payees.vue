<template>
  <q-page padding class="text-colour2">
    <payees-toolbar
      title="Payees"
      :filter="filter"
      @filter="onFilter"
      @menu-clicked="onMenuClicked"
    />

    <RecycleScroller
      page-mode
      class="scroller"
      :items="payees"
      :item-size="42"
      key-field="id"
      v-slot="{ item }"
    >
      <div class="scroller-item" @click="itemClicked(item)">
        <div class="scroller-item-content">
          {{ item }}
        </div>
      </div>
    </RecycleScroller>

    <!-- <q-list>
      <q-item v-for="payee in payees" :key="payee">
        <q-item-section>{{ payee }}</q-item-section>
      </q-item>
    </q-list> -->

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="check"
        color="accent"
        text-color="secondary"
        @click="onAcceptClick"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'

const mainStore = useMainStore()

function onMenuClicked() {
  mainStore.toggleDrawer()
}
</script>
<script lang="ts">
import { SET_SELECTED_ID } from '../mutations'
import PayeesToolbar from '../components/PayeesToolbar.vue'
import appService from '../appService'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { Constants, settings, SettingKeys } from '../lib/Configuration'
import { CashierSync } from '../lib/syncCashier'

export default {
  components: {
    RecycleScroller,
    PayeesToolbar,
  },
  data: function () {
    return {
      payees: [],
      addDialogVisible: false,
      newPayee: null,
      filter: null,
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    /**
     * Currently we only use click for selecting a Payee in a Transaction.
     * In standalone page, ignore the event.
     */
    itemClicked(id) {
      // select the item and return to the caller.
      let meta = this.$store.state.selectModeMeta

      if (!meta) return

      if (meta.selectionType !== 'payee') {
        throw 'Invalid selection mode!'
      }

      this.$store.commit(SET_SELECTED_ID, id)

      // Simply go back, assuming that the previous page is requesting the data.
      this.$router.go(-1)
    },
    async loadData() {
      // get the payees from the cache
      const cache = await caches.open(Constants.CacheName)

      const serverUrl = await settings.get(SettingKeys.syncServerUrl)
      const cashierSync = new CashierSync(serverUrl)
      const payeesCache = await cache.match(cashierSync.getPayeesUrl())

      let payees = await payeesCache.json()

      // Apply filter
      if (this.filter) {
        // todo: option for case-sensitivity?
        this.payees = payees.filter(
          (payee) =>
            payee.toLowerCase().indexOf(this.filter.toLowerCase()) != -1
        )
      } else {
        this.payees = payees
      }
    },
    onAddPayee() {
      if (!this.newPayee) return

      this.addDialogVisible = false

      appService.addPayee(this.newPayee).then(() => {
        // clear the "new payee" name for a new entry
        this.newPayee = null
        this.loadData()
      })
    },
    onAcceptClick() {
      this.itemClicked(this.filter)
    },
    async onFilter(text) {
      this.filter = text
      await this.loadData()
    },
  },
}
</script>

<style lang="scss" scoped>
.scroller {
  height: 100%;
}

.scroller-item {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.scroller-item-content {
  flex-grow: 1;
}
.scroller-item-action {
  text-align: right;
}
</style>