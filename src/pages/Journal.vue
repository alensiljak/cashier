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

    <q-slide-item
      v-for="tx in transactions"
      :key="tx.id"
      dark
      right-color="secondary"
      @right="onSlide"
    >
      <template #right>
        <div
          class="row items-center text-accent"
          @click="deleteTransaction(tx.id)"
        >
          Click to confirm or wait 2s to cancel
          <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
        </div>
      </template>

      <journal-transaction :tx="tx" @click.once="onTxClick(tx.id)" />
    </q-slide-item>

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
      <q-card dark class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="accent"
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
      <q-card dark class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete all transactions?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="accent"
            @click="confirmDeleteAll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/mainStore'

const $q = useQuasar()
const router = useRouter()
const mainStore = useMainStore()

async function onTxClick(id) {
  if (typeof id !== 'number') {
    $q.notify({
      message: 'The id (' + id + ') is not numeric! Try again.',
      color: 'negative',
    })
  }

  // load tx
  await mainStore.loadTx(id)

  await router.push({ name: 'tx-actions', params: { id: id } })
}
</script>
<script>
import appService from '../appService'
import JournalTransaction from '../components/JournalTransaction.vue'
import { TOGGLE_DRAWER } from '../mutations'

const errorMessage = { color: 'secondary', message: '' }

export default {
  components: {
    JournalTransaction,
  },
  data() {
    return {
      confirmDeleteVisible: false,
      confirmDeleteAllVisible: false,
      transactions: [],
      resetSlide: null,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async confirmDelete() {
      await this.deleteTransaction()
    },
    confirmDeleteAll() {
      this.deleteAllTransactions()
    },
    /**
     * delete all transactions
     */
    async deleteAllTransactions() {
      try {
        await appService.deleteTransactions()
        this.$q.notify({ message: 'transactions deleted' })

        await this.loadData()
      } catch (reason) {
        this.$q.notify({ message: reason, color: 'danger' })
      }
    },
    async deleteTransaction(id) {
      if (!id) {
        this.$q.notify({
          color: 'negative',
          message: 'No transaction id sent for deletion.',
        })
      }

      // remove the reset reference.
      if (this.resetSlide) {
        // remove the slide section.
        this.resetSlide()
        this.resetSlide = null
      }

      try {
        const result = await appService.deleteTransaction(id)
        // console.debug('delete result:', result)
        this.$q.notify({ message: 'Transaction deleted', color: 'positive' })

        await this.loadData()
      } catch (error) {
        this.$q.notify({ color: 'negative', message: error.message })
      }
    },
    exportJournal() {
      this.$router.push({ name: 'export' })
    },
    finalize(reset) {
      this.timer = setTimeout(() => {
        // has it been already deleted?
        if (!this.resetSlide) return

        reset()
      }, 2000)
    },
    async loadData() {
      // load all transactions
      try {
        this.transactions = await appService.db.transactions
          .orderBy('date')
          .reverse()
          .toArray()
      } catch (error) {
        errorMessage.message = error.message
        this.$q.notify(errorMessage)
      }
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
    onDeleteAllClicked() {
      this.confirmDeleteAllVisible = true
    },
    onSlide({ reset }) {
      this.resetSlide = reset
      this.finalize(reset)
    },
    onTransactionDeleteClicked(data) {
      // confirm
      this.confirmDeleteVisible = true
      this.transactionIdToDelete = data.id
    },
    openNewTransaction() {
      this.mainStore.newTx()

      this.$router.push({ name: 'tx' })
    },
  },
}
</script>
