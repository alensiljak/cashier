<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar title="Transaction Actions" />

    <journal-transaction :tx="tx" v-if="txLoaded" />

    <div id="actions" class="q-mt-lg column text-center">
      <!-- Edit -->
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click.once="onEditClicked"
      >
        <font-awesome-icon
          icon="save"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Edit
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onDuplicateClicked"
      >
        <font-awesome-icon
          icon="copy"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Duplicate
      </q-btn>
      <q-btn
        color="accent"
        text-color="secondary"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onScheduleClick"
      >
        <font-awesome-icon
          icon="calendar-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Schedule
      </q-btn>
      <q-btn
        v-if="$store.getters.liveModeOn"
        size="1.3rem"
        color="primary"
        text-color="accent"
        class="q-my-lg q-mx-md"
        @click="onXactClicked"
      >
        <font-awesome-icon
          icon="scroll"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        xact
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onCopyClicked"
      >
        <font-awesome-icon
          icon="copy"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        copy ledger entry
      </q-btn>
      <q-btn
        v-if="tx && tx.id"
        color="secondary"
        text-color="accent"
        size="1.3rem"
        class="q-my-lg q-mx-md"
        @click="onDeleteClick"
      >
        <font-awesome-icon
          icon="trash-alt"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        Delete
      </q-btn>
    </div>

    <!-- confirm tx deletion dialog -->
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
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
// import { storeToRefs } from 'pinia'
// import { usePiniaStore } from '../store/piniaStore'
import { useTxStore } from '../store/txStore'
import { onMounted } from 'vue'
import { CurrentTransactionService } from '../lib/currentTransactionService'

// const { item } = storeToRefs(usePiniaStore())
// const { modify } = usePiniaStore()
const txStore = useTxStore()
const { tx } = txStore

const props = defineProps({ id: String })

let txLoaded = ref(false)

if (!tx) {
  console.debug('creating a new tx')
  const newTx = new CurrentTransactionService().createTransaction()
  //tx = reactive(newTx)
  txStore.setTx(newTx)
}

async function loadData() {
  const id = getNumericId()
  const record = await appService.loadTransaction(id)
  txStore.setTx(record)

  txLoaded.value = true
}

onMounted(async () => {
  await loadData()
})

function getNumericId() {
  // when navigating back, the id becomes string instead of original numeric
  if (typeof props.id === 'string') {
    return Number(props.id)
  }
  if (typeof props.id === 'number') {
    return props.id
  }

  throw new Error('Invalid Id value')
}
</script>
<script>
import Toolbar from '../components/CashierToolbar.vue'
import JournalTransaction from '../components/JournalTransaction.vue'
import appService from '../appService'

export default {
  components: {
    Toolbar,
    JournalTransaction,
  },
  data() {
    return {
      //tx: {},
      confirmDeleteVisible: false,
    }
  },
  methods: {
    /**
     * The user confirmed the deletion.
     */
    async confirmDelete() {
      await this.deleteTransaction()

      this.$router.back()
    },
    async deleteTransaction() {
      const id = this.getNumericId()

      try {
        await appService.deleteTransaction(id)
        this.$q.notify({ message: 'Transaction deleted', color: 'positive' })
      } catch (reason) {
        this.$q.notify({ message: reason.message, color: 'negative' })
      }
    },
    async onCopyClicked() {
      // get a journal version
      const text = await appService.translateToLedger(this.tx)

      // copy to clipboard
      await navigator.clipboard.writeText(text)
      this.$q.notify({
        message: 'transaction copied to clipboard',
        color: 'positive',
      })
    },
    onDeleteClick() {
      // show the confirmation dialog.
      this.confirmDeleteVisible = true
    },
    async onDuplicateClicked() {
      // create the transaction
      const newTx = await appService.duplicateTransaction(this.tx)
      // save
      const id = await appService.saveTransaction(newTx)

      // display a notification after or ask before the action.
      this.$q.notify({ color: 'positive', message: 'Transaction duplicated' })

      // navigate to the editor for the new transaction,
      // resetting the navigation?
      this.$router.push({ name: 'tx', params: { id: id } })
    },
    onEditClicked() {
      const id = this.getNumericId()
      this.$router.push({ name: 'tx', params: { id: id } })
    },
    onScheduleClick() {
      // the journal transaction stays in the store and is available in the sch.tx editor.
      // id 0 will cause it to reset the scheduled transaction.
      // Save the tx to the store first.
      new CurrentTransactionService(this.$store).setTx(this.tx)

      this.$router.push({ name: 'scheduledtxeditor', params: { id: 0 } })
    },
    onXactClicked() {
      this.$router.push({ name: 'xact', params: { payee: this.tx.payee } })
    },
  },
}
</script>
<style lang="sass" scoped>
.large-button
  width: 90%
</style>
