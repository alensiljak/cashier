<template>
  <q-page padding class="bg-colour1 text-colour2">
    <payees-toolbar
      title="Payees"
      :filter="filter"
      @filter="onFilter"
      @menu-clicked="onMenuClicked"
    />

    <!-- <DynamicScroller 
      class="scroller"
      :items="payees"
      :item-size="42"
      key-field="id"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[
            item.message,
          ]"
          :data-index="index"
        >
          <div class="scroller-item" @click="itemClicked(item)">
            {{ item }}
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller> -->

    <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="payees"
      :item-size="42"
      key-field="id"
    >
      <div class="scroller-item" @click="itemClicked(item)">
        <div class="scroller-item-content">
          {{ item }}
        </div>
      </div>
    </RecycleScroller>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="check" color="accent" text-color="secondary" @click="onAcceptClick" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER, SET_SELECT_MODE } from '../mutations'
import PayeesToolbar from '../components/PayeesToolbar'
import appService from '../appService'
//import { ListSearch } from '../ListSearch.js'
import { DynamicScroller, DynamicScrollerItem, RecycleScroller } from 'vue-virtual-scroller'
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

  created() {
    this.loadData()
  },

  methods: {
    itemClicked(id) {
      // select the item and return to the caller.
      let meta = this.$store.getters.selectionModeMeta

      if (!meta || meta.selectionType !== 'payee') {
        throw('Invalid selection mode!')
      }

      meta.selectedId = id
      this.$store.commit(SET_SELECT_MODE, meta)

      // Simply go back, assuming that the previous page is requesting the data.
      this.$router.go(-1)
    },
    async loadData() {
      // get the payees from the cache
      const cache = await caches.open(Constants.CacheName)

      const serverUrl = await settings.get(SettingKeys.syncServerUrl)
      const cashierSync = new CashierSync(serverUrl)
      const payeesCache = await cache.match(cashierSync.payeesUrl)

      let payees = await payeesCache.json()
      payees = payees.split('\n')

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
    onMenuClicked() {
      const visible = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
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