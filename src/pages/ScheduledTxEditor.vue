<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title>Scheduled Transaction Edit</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <tx-editor />

    <q-separator dark class="q-my-lg" />

    <schedule-editor v-model="scheduledTx" />
  </q-page>
</template>
<script setup>
import { onMounted, provide, reactive } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

const store = useStore();
const $q = useQuasar();

let scheduledTx = store.getters.clipboard;

// onCreated
if (!scheduledTx) {
  // initialize for data binding.
  scheduledTx = reactive(new ScheduledTransaction());
}

provide("scheduledTx", scheduledTx);

onMounted(async () => {
  try {
    const id = getId();
    let stx = await loadData(id);
    use(stx);
  } catch (error) {
    $q.notify({ message: error.message, color: "negative" });
  }
});

async function loadData(id) {
  if (typeof id === "string") {
    // convert to a numeric value
    id = parseInt(id);
  }

  let result = null;

  // Special case. ID of 0 should be used to reset the Sch.Tx in the state.
  // This is necessary for the case when using a 'schedule' action from the tx actions.
  if (id === 0) {
    // Reset the Scheduled transaction.
    result = new ScheduledTransaction();
    // But use the journal transaction from the state

    return result;
  }

  // load existing record
  let schTx = await appService.db.scheduled.get(id);
  if (!schTx) {
    throw new Error("Scheduled transaction not loaded", id);
  }
  return schTx;
}

function getId() {
  const route = useRoute();
  const id = route.params.id;
  return id;
}

/**
 * Sets the given Scheduled Transaction as the active object, being edited.
 */
function use(scheduledTransaction) {
  //this.scheduledTx = reactive(scheduledTransaction)
  Object.assign(scheduledTx, scheduledTransaction);

  // put into the store the attached journal transaction.
  const transaction = JSON.parse(scheduledTransaction.transaction);

  // make tx available for editing
  const txSvc = new CurrentTransactionService(store);
  txSvc.setTx(transaction);
}
</script>
<script>
import TxEditor from "../components/TransactionEditor.vue";
import ScheduleEditor from "../components/ScheduleEditor.vue";
import appService from "../appService";
import { CurrentTransactionService } from "../lib/currentTransactionService";
import { ScheduledTransaction } from "../model";
import eventBus from "../lib/eventBus";

export default {
  components: {
    ScheduleEditor,
    TxEditor,
  },

  emits: ["toggleDrawer"],

  methods: {
    resetTransaction() {
      this.use(new ScheduledTransaction());
    },
    /**
     * Saves the scheduled transaction to the data store.
     */
    async saveData() {
      //const stx = this.scheduledTx
      let stx = structuredClone(this.scheduledTx);

      // serialize transaction
      let tx = structuredClone(this.$store.getters.transaction);

      // do not store any transaction ids!
      tx.id = null;
      const txStr = JSON.stringify(tx);
      stx.transaction = txStr;
      //stx.transaction = tx

      // reuse transaction date. For indexing only.
      stx.nextDate = tx.date;

      const result = await appService.saveScheduledTransaction(stx);
      // console.log('saved', result)
      return result;
    },
    async onSaveClicked() {
      /// Triggered on Save button click

      const result = await this.saveData();

      if (result) {
        this.resetTransaction();
        //this.$router.push({ name: 'scheduledtransactions' })
        this.$router.back();
      }
    },
    toggleDrawer() {
      eventBus.$emit("toggle-drawer");
    },
  },
};
</script>
