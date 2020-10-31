<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- Toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="menuClicked"
        />

        <q-toolbar-title>Device Journal</q-toolbar-title>

        <!-- <q-btn flat round dense icon="sim_card" class="q-mr-xs" /> -->
        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item v-close-popup clickable>
                <q-item-section @click="exportJournal">Export</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="sign-out-alt"
                    transform="grow-9 left-5"
                  />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onDeleteAllClicked">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="trash-alt"
                    transform="grow-9 left-5"
                  />
                </q-item-section>
              </q-item>

              <!-- <q-item v-close-popup clickable @click="onHelpClick">
                <q-item-section>Help</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="question-circle" transform="grow-9 left-5" />
                </q-item-section>
              </q-item> -->
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
        @tx-delete-clicked="onTransactionDeleteClicked"
      />
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="accent"
        text-color="secondary"
        @click="openNewTransaction"
      >
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="confirmDeleteVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="amber-4" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="amber-4"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- delete all dialog -->
    <q-dialog
      v-model="confirmDeleteAllVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete all transactions?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="amber-4" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="amber-4"
            @click="confirmDeleteAll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from '../mutations'
import appService from '../appService'
import JournalTransaction from '../components/JournalTransaction'

const errorMessage = { color: 'secondary', message: '' }

export default {
  components: {
    JournalTransaction,
  },
  data() {
    return {
      transactionIdToDelete: null,
      confirmDeleteVisible: false,
      confirmDeleteAllVisible: false,
      transactions: [],
    }
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false)

    this.loadData()
  },
  mounted() {
    // this.$q.notify('yo')
  },

  methods: {
    confirmDelete() {
      this.deleteTransaction()
    },
    confirmDeleteAll() {
      this.deleteAllTransactions()
    },
    /**
     * delete all transactions
     */
    deleteAllTransactions() {
      appService
        .deleteTransactions()
        .then(() => {
          this.$q.notify({ message: 'transactions deleted' })
          this.loadData()
        })
        .catch((reason) => this.$q.notify({ message: reason, color: 'danger' }))
    },
    async deleteTransaction() {
      let id = this.transactionIdToDelete

      try {
        await appService.deleteTransaction(id)
        this.$q.notify('Transaction deleted')
        this.loadData()
      } catch (reason) {
        errorMessage.message = reason.message
        this.$q.notify(errorMessage)
      }
    },
    exportJournal() {
      this.$router.push({ name: 'export' })
    },
    loadData() {
      // load all transactions and related postings
      appService.db.transactions
        .orderBy('date')
        .reverse()
        .toArray()
        .then((value) => {
          this.transactions = value
        })
        .catch((reason) => {
          errorMessage.message = reason
          this.$q.notify(errorMessage)
        })
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
    onDeleteAllClicked() {
      this.confirmDeleteAllVisible = true
    },
    onHelpClick(event) {
      // todo: show help
    },
    onItemClicked(event) {
      console.log('clicked', event)
    },
    onTransactionDeleteClicked(data) {
      // confirm
      this.confirmDeleteVisible = true
      this.transactionIdToDelete = data.id
    },
    openNewTransaction() {
      this.$router.push({ name: 'tx' })
    },
  },
}
</script>
