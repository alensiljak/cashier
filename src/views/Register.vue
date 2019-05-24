<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Register</q-toolbar-title>

        <q-btn flat round dense icon="fas fa-ellipsis-v">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <!-- <q-item clickable v-close-popup>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <q-icon name="sync"/>
                </q-item-section>
              </q-item>-->
              <q-item clickable v-close-popup>
                <q-item-section @click="exportRegister">Export</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div>Transactions go here. Show all if not filtered by a specific account.</div>

    <q-list dark>
      <register-transaction
        v-for="tx in transactions"
        :key="tx.id"
        :tx="tx"
        @txDeleteClicked="onTransactionDeleteClicked"
      />
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" text-color="secondary" @click="openNewTransaction"/>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog v-model="confirmDeleteVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-teal-9">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span> -->
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="amber-4" v-close-popup/>
          <q-btn flat label="Delete" color="amber-4" v-close-popup @click="confirmDelete"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR } from "../mutations";
import appService from "../appService";
import RegisterTransaction from "../components/RegisterTransaction";

const errorMessage = { color: "secondary", message: "" };

export default {
  data() {
    return {
      transactionIdToDelete: null,
      confirmDeleteVisible: false,
      transactions: []
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    this.loadData();
  },
  mounted() {
    // this.$q.notify('yo')
  },

  methods: {
    confirmDelete() {
      this.deleteTransaction()
    },
    deleteTransaction() {
      let id = this.transactionIdToDelete
      var that = this;

      appService
        .deleteTransaction(id)
        .then(() => {
          this.$q.notify("Transaction deleted");
          this.loadData();
        })
        .catch(reason => {
          // console.error(reason)
          errorMessage.message = reason.message;
          that.$q.notify(errorMessage);
        });
    },
    exportRegister() {
      this.$router.push({ name: "export" });
    },
    loadData() {
      // load all transactions and related postings
      appService.db.transactions
        .orderBy("date")
        .reverse()
        .toArray()
        .then(value => {
          this.transactions = value;
        })
        .catch(reason => {
          errorMessage.message = reason;
          this.$q.notify(errorMessage);
        });
    },
    menuClicked() {
      console.log("menu clicked");
    },
    onItemClicked(event) {
      console.log("clicked", event);
    },
    onTransactionDeleteClicked(data) {
      // confirm
      this.confirmDeleteVisible = true;
      this.transactionIdToDelete = data.id
    },
    openNewTransaction() {
      this.$router.push({ name: "tx" });
    }
  },
  components: {
    RegisterTransaction
  }
};
</script>
