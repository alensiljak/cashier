<template>
  <q-page padding class="bg-colour1 text-colour2">
    <payees-toolbar
      title="Payees"
      :filter="filter"
      @filter="onFilter"
      @menuClicked="onMenuClicked"
      @deleteAllClicked="onDeleteAllClicked"
    />

    <RecycleScroller
      class="scroller"
      :items="payees"
      :item-size="42"
      key-field="id"
      v-slot="{ item }"
    >
      <div class="scroller-item" @click="itemClicked(item.id)">{{ item.name }}</div>
    </RecycleScroller>

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFab">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>

    <!-- new payee (name) dialog -->
    <q-dialog dark v-model="addDialogVisible">
      <!-- persistent -->
      <q-card style="min-width: 400px" class="bg-primary text-colour2">
        <q-card-section>
          <div class="text-h6">New Payee</div>
        </q-card-section>

        <q-card-section>
          <q-input
            dense
            v-model="newPayee"
            autofocus
            @keyup.enter="onAddPayee"
            input-class="text-amber-2"
            color="amber-4"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-accent">
          <q-btn flat label="Cancel" v-close-popup @click="onCancelAdd"/>
          <q-btn flat label="Add" v-close-popup @click="onAddPayee"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirm deletion dialog -->
    <q-dialog v-model="confirmDeleteAllVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-red-10">
        <q-card-section class="row items-center">
          <span>Do you want to delete all payees?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="amber-4" v-close-popup/>
          <q-btn flat label="Delete" color="amber-4" v-close-popup @click="deleteAllConfirmed"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from "../mutations";
import PayeesToolbar from "../components/PayeesToolbar";
import appService from "../appService";
import { ListSearch } from "../ListSearch.js";
import Vue from "vue";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

Vue.component("RecycleScroller", RecycleScroller);

export default {
  data: function() {
    return {
      payees: [],
      addDialogVisible: false,
      newPayee: null,
      filter: null,
      confirmDeleteAllVisible: false
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);
    this.loadData();
  },
  mounted() {},

  methods: {
    deleteAllConfirmed() {
      appService.deletePayees().then(() => this.loadData());
    },
    itemClicked(id) {
      console.log("item:", id);
    },
    loadData() {
      // get the payees
      let payeeSource = appService.db.payees;

      if (this.filter) {
        let search = new ListSearch()
        let regex = search.getRegex(this.filter);

        payeeSource = payeeSource.filter(payee => {
          // return payee.name.indexOf(this.filter) !== -1;
          // var hasS = new RegExp("^[s\s]+$").test(a);
          // let regex = new RegExp("/" + this.filter + "/")
          // let regex = new RegExp(this.filter);

          return regex.test(payee.name);
        });
      }
      payeeSource.toArray().then(payees => (this.payees = payees));
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
    onFab() {
      this.newPayee = this.filter;
      this.addDialogVisible = true;
    },
    onFilter(text) {
      // console.log('filter:', text)
      this.filter = text;
      this.loadData();
    },
    onMenuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    }
  },

  components: {
    PayeesToolbar
  }
};
</script>
