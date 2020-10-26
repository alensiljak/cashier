<template>
  <q-page padding class="bg-colour1 text-colour2">
    <payees-toolbar
      title="Payees"
      :filter="filter"
      @filter="onFilter"
      @menu-clicked="onMenuClicked"
      @delete-all-clicked="onDeleteAllClicked"
    />

    <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="payees"
      :item-size="42"
      key-field="id"
    >
      <div class="scroller-item" @click="itemClicked(item)">
        {{ item }}
      </div>
    </RecycleScroller>

    <!-- floating action button -->
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFab">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky> -->

    <!-- new payee (name) dialog -->
    <!-- <q-dialog v-model="addDialogVisible" dark>
      <q-card style="min-width: 400px" class="bg-primary text-colour2">
        <q-card-section>
          <div class="text-h6">New Payee</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newPayee"
            dense
            autofocus
            input-class="text-amber-2"
            color="amber-4"
            @keyup.enter="onAddPayee"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-accent">
          <q-btn v-close-popup flat label="Cancel" @click="onCancelAdd" />
          <q-btn v-close-popup flat label="Add" @click="onAddPayee" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="confirmDeleteAllVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-red-10">
        <q-card-section class="row items-center">
          <span>Do you want to delete all payees?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="amber-4" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="amber-4"
            @click="deleteAllConfirmed"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER, SET_SELECT_MODE } from '../mutations';
import PayeesToolbar from '../components/PayeesToolbar';
import appService from '../appService';
import { ListSearch } from '../ListSearch.js';
import Vue from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { Constants, settings, SettingKeys } from '../lib/Configuration';
import { CashierSync } from '../lib/syncCashier';

Vue.component('RecycleScroller', RecycleScroller);

export default {
  components: {
    PayeesToolbar,
  },
  data: function () {
    return {
      payees: [],
      addDialogVisible: false,
      newPayee: null,
      filter: null,
      confirmDeleteAllVisible: false,
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);
    this.loadData();
  },
  mounted() {},

  methods: {
    async deleteAllConfirmed() {
      await appService.deletePayees();
      await this.loadData();
    },
    itemClicked(id) {
      // console.log('item:', id);
        // select the item and return to the caller.
        let meta = this.$store.state.selectModeMeta;

        meta.selectedId = id;
        this.$store.commit(SET_SELECT_MODE, meta);

        let route = meta.originRoute;
        this.$router.push(route);
    },
    async loadData() {
      // get the payees from the cache
      const cache = await caches.open(Constants.CacheName);

      const serverUrl = await settings.get(SettingKeys.syncServerUrl);
      const cashierSync = new CashierSync(serverUrl);
      const payeesCache = await cache.match(cashierSync.payeesUrl);

      let payees = await payeesCache.text()
      payees = payees.split('\n')

      // Apply filter
      if (this.filter) {
        // todo: option for case-sensitivity?
        this.payees = payees.filter(
          payee => payee.toLowerCase().indexOf(this.filter.toLowerCase()) != -1)
      } else {
        this.payees = payees
      }
    },
    onAddPayee() {
      if (!this.newPayee) return;

      this.addDialogVisible = false;

      appService.addPayee(this.newPayee).then(() => {
        // clear the "new payee" name for a new entry
        this.newPayee = null;
        this.loadData();
      });
    },
    onCancelAdd() {
      // console.log('cancel add')
      this.newPayee = null;
    },
    onDeleteAllClicked() {
      // confirm
      this.confirmDeleteAllVisible = true;
    },
    // onFab() {
    //   this.newPayee = this.filter;
    //   this.addDialogVisible = true;
    // },
    async onFilter(text) {
      this.filter = text;
      await this.loadData();
    },
    onMenuClicked() {
      const visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
  },
};
</script>
