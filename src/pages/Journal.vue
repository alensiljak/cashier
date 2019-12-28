<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Journal</q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup>
                <q-item-section @click="exportJournal">Export</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="sign-out-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onDeleteAllClicked">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="trash-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- <div>Transactions go here. Show all if not filtered by a specific account.</div> -->

    <q-list dark>
      <journal-transaction
        v-for="tx in transactions"
        :key="tx.id"
        :tx="tx"
        @txDeleteClicked="onTransactionDeleteClicked"
      />
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="openNewTransaction">
        <font-awesome-icon icon="plus" transform="grow-6"/>
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog v-model="confirmDeleteVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="amber-4" v-close-popup/>
          <q-btn flat label="Delete" color="amber-4" v-close-popup @click="confirmDelete"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- delete all dialog -->
    <q-dialog v-model="confirmDeleteAllVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete all transactions?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="amber-4" v-close-popup/>
          <q-btn flat label="Delete" color="amber-4" v-close-popup @click="confirmDeleteAll"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from "../mutations";
import appService from "../appService";
import JournalTransaction from "../components/JournalTransaction";

const errorMessage = { color: "secondary", message: "" };

export default {
  data() {
    return {
      transactionIdToDelete: null,
      confirmDeleteVisible: false,
      confirmDeleteAllVisible: false,
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
      this.deleteTransaction();
    },
    confirmDeleteAll() {
      this.deleteAllTransactions();
    },
    deleteAllTransactions() {
            // delete all transactions
      appService.deleteTransactions()
        .then(() => {
          this.$q.notify({message: 'transactions deleted'})
          this.loadData()
        })
        .catch(reason => this.$q.notify({message: reason, color: 'danger'}))
    },
    deleteTransaction() {
      let id = this.transactionIdToDelete;

      appService
        .deleteTransaction(id)
        .then(() => {
          this.$q.notify("Transaction deleted");
          this.loadData();
        })
        .catch(reason => {
          errorMessage.message = reason.message;
          this.$q.notify(errorMessage);
        });
    },
    exportJournal() {
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
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onDeleteAllClicked() {
      this.confirmDeleteAllVisible = true;
    },
    onItemClicked(event) {
      console.log("clicked", event);
    },
    onTransactionDeleteClicked(data) {
      // confirm
      this.confirmDeleteVisible = true;
      this.transactionIdToDelete = data.id;
    },
    openNewTransaction() {
      this.$router.push({ name: "tx" });
    }
  },
  components: {
    JournalTransaction
  }
};
</script>