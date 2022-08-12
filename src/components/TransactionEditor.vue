<template>
  <div>
    <!-- date -->
    <div id="dateSelector">
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date
          ref="datePicker"
          v-model="tx.date"
          dark
          first-day-of-week="1"
          today-btn
          mask="YYYY-MM-DD"
          @input="onDateSelected"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <!-- <q-btn v-close-popup label="Cancel" color="primary" flat /> -->
            <q-btn v-close-popup label="OK" color="accent" flat />
          </div>
        </q-date>
      </q-dialog>

      <q-input
        v-model="tx.date"
        label="Date"
        dark
        @click="datePickerVisible = true"
      >
        <template #prepend>
          <font-awesome-icon icon="calendar-day" />
        </template>
      </q-input>
    </div>

    <!-- payee -->
    <q-input v-model="tx.payee" label="Payee" dark @click.once="onPayeeClick">
      <template #prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>

    <!--note -->
    <q-input v-model="tx.note" label="Note" dark>
      <template #prepend>
        <font-awesome-icon icon="file-alt" />
      </template>
    </q-input>

    <!-- Postings -->
    <div class="row q-mt-sm bg-primary">
      <div class="col-auto q-px-xs">Postings</div>
    </div>

    <div>
      <q-slide-item
        v-for="(posting, index) in tx.postings"
        :key="index"
        dark
        left-color="secondary"
        class="q-px-none"
        @left="onSlide"
      >
        <template #left>
          <div
            class="row items-center text-accent"
            @click="deletePosting(index)"
          >
            Click to confirm or wait 2s to cancel
            <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
          </div>
        </template>
        <q-item dark class="bg-colour1 q-px-none">
          <q-item-section>
            <QPosting
              :index="index"
              @delete-row="deletePosting"
              @account-clicked="onAccountClicked(index)"
              @amount-changed="onAmountChanged"
            />
          </q-item-section>
        </q-item>
      </q-slide-item>

      <!-- Sum -->
      <q-item dark>
        <q-item-section>
          <q-item-label>Sum</q-item-label>
        </q-item-section>
        <q-item-section avatar>{{ formatNumber(postingSum) }}</q-item-section>
      </q-item>
    </div>

    <!-- posting actions -->
    <div class="row justify-center text-center q-mb-md">
      <q-btn
        color="primary"
        text-color="accent"
        size="medium"
        class="col-auto q-mr-md"
        @click="addPosting"
      >
        <font-awesome-icon
          icon="plus-circle"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        <div>Add</div>
      </q-btn>
      <q-btn
        color="primary"
        text-color="accent"
        size="medium"
        class="col-auto"
        @click="reorderPostings"
      >
        <font-awesome-icon
          icon="sort"
          transform="grow-9"
          class="q-icon-small on-left"
        />
        <div>Reorder</div>
      </q-btn>
    </div>
  </div>
</template>
<script>
import appService from "../appService";
import { SET_SELECT_MODE, SET_PAYEE, SET_POSTING } from "../mutations";
import { CurrentTransactionService } from "../lib/currentTransactionService";
import {
  SelectionModeMetadata,
  SettingKeys,
  settings,
} from "../lib/Configuration";
import QPosting from "../components/Posting.vue";
import { Posting } from "../model";
import { toRaw } from "vue";

export default {
  components: {
    QPosting,
  },

  data() {
    return {
      datePickerVisible: false,
      resetSlide: null,
      postingSum: 0,
    };
  },

  computed: {
    tx: {
      get() {
        let tx = this.$store.getters.transaction;

        if (tx === null) {
          tx = this.resetTransaction();
        } else {
          // fix postings
          if (!tx.postings) {
            this.$store.dispatch("resetPostings");
          }
        }
        return tx;
      },
      set(value) {
        // save in the state store
        new CurrentTransactionService(this.$store).setTx(value);
      },
    },
  },

  created() {
    // are we back from the select mode?
    if (this.$store.getters.selectionModeMeta) {
      this.handleSelection();
    }
  },
  mounted: function () {
    this.recalculateSum();
  },

  methods: {
    addPosting() {
      // fix postings
      if (!this.tx.postings) {
        this.tx.postings = [];
      }

      this.tx.postings.push(new Posting());
    },
    deletePosting(index) {
      if (this.resetSlide) {
        // remove the slide section.
        this.resetSlide();
        this.resetSlide = null;
      }

      this.tx.postings.splice(index, 1);

      this.recalculateSum();
    },
    finalizeSlide(reset) {
      this.timer = setTimeout(() => {
        // has it been already deleted?
        if (!reset) return;

        reset();
      }, 2000);
    },
    formatNumber(value) {
      return appService.formatNumber(value);
    },
    /**
     * Find an empty posting, or create one.
     */
    getEmptyPostingIndex() {
      for (let i = 0; i < this.tx.postings.length; i++) {
        const posting = this.tx.postings[i];
        if (!posting.account && !posting.amount && !posting.commodity) {
          return i;
        }
      }

      // not found. Create a new one.
      const posting = new Posting();
      this.tx.postings.push(posting);
      return this.tx.postings.length - 1;
    },
    /**
     * Handle selection after a picker returned.
     */
    async handleSelection() {
      // todo handle blank id if the user presses 'back'.
      const select = this.$store.getters.selectionModeMeta;
      const id = select.selectedId;

      switch (select.selectionType) {
        case "payee":
          this.$store.commit(SET_PAYEE, id);
          await this.loadLastTransaction(id);
          break;
        case "account":
          // get the posting
          var index = null;
          if (typeof select.postingIndex === "number") {
            index = select.postingIndex;
          } else {
            // redirected from account register, find an appropriate posting
            index = this.getEmptyPostingIndex();
          }
          let posting = this.tx.postings[index];
          //let clone = structuredClone(posting)
          let clone = toRaw(posting);

          //let posting = this.$store.getters.posting(index)

          const account = await appService.db.accounts.get(id);
          clone.account = account.name;
          clone.currency = account.currency;

          this.$store.commit(SET_POSTING, { index: index, posting: clone });
          break;
      }

      // clean-up, reset the selection values
      this.$store.commit(SET_SELECT_MODE, null);
    },
    /**
     * Load the last transaction for the payee
     */
    async loadLastTransaction(payee) {
      // do this only if enabled
      const enabled = await settings.get(SettingKeys.rememberLastTransaction);
      if (!enabled) return;
      // and we are not on an existing transaction
      if (this.tx.id) return;

      const lastTx = await appService.db.lastTransaction.get(payee);
      if (!lastTx) return;
      // use the current date
      lastTx.transaction.date = this.tx.date;
      // Replace the current transaction.
      this.tx = lastTx.transaction;
    },
    onAccountClicked(index) {
      const selectMode = new SelectionModeMetadata();

      // save the index of the posting being edited
      selectMode.postingIndex = index;
      // set the type
      selectMode.selectionType = "account";

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode);
      // show account picker
      this.$router.push({ name: "accounts" });
    },
    onAmountChanged() {
      // recalculate the sum
      this.recalculateSum();
    },
    /**
     * (value, reason, details)
     */
    onDateSelected(value, reason) {
      if (reason !== "day" && reason !== "today") return;

      // close the picker if the date was selected
      this.$refs.qDateProxy.hide();
      // the date is saved on close.
    },
    onPayeeClick() {
      const selectMode = new SelectionModeMetadata();

      // set the type
      selectMode.selectionType = "payee";

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode);
      // show account picker
      this.$router.push({ name: "payees" });
    },
    onSlide({ reset }) {
      this.resetSlide = reset;
      this.finalizeSlide(reset);
    },
    recalculateSum() {
      this.postingSum = 0;

      if (!this.postings) return;

      for (let i = 0; i < this.tx.postings.length; i++) {
        const posting = this.tx.postings[i];
        if (!isNaN(posting.amount)) {
          this.postingSum += posting.amount;
        } else {
          console.warn("The amount is not a number:", posting.amount);
        }
      }
    },
    reorderPostings() {
      this.$router.push({ name: "reorder postings" });
    },
    resetTransaction() {
      const tx = new CurrentTransactionService(this.$store).createTransaction();
      this.tx = tx;
      return tx;
    },
  },
};
</script>
