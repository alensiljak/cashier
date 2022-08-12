<template>
  <div>
    <div class="row">
      <div class="col">
        <!-- Account -->
        <q-input
          v-model="account"
          dark
          label="Account"
          @click="$emit('account-clicked')"
        />
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-3 col-xs-5">
        <!-- Amount -->
        <q-input
          v-model.number="amount"
          dark
          label="Amount"
          type="number"
          input-class="text-right"
          @change="$emit('amount-changed')"
          @focus="onAmountFocus"
        />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <q-input v-model="currency" dark label="Currency">
          <template #append>
            <!-- warn if there's no currency but we have an amount -->
            <font-awesome-icon
              v-if="isMissingCurrency"
              icon="exclamation-circle"
              style="color: #92140c"
            />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
import { SET_POSTING } from "../mutations";
import { toRaw } from "vue";

export default {
  props: {
    index: { type: Number, default: null },
  },

  data: function () {
    return {
      accountOptions: null,
    };
  },

  computed: {
    account: {
      get() {
        return this.$store.getters.transaction.postings[this.index].account;
      },
      set(value) {
        let posting = this.$store.getters.transaction.postings[this.index];

        //let clone = structuredClone(posting);
        let clone = toRaw(posting);

        clone.account = value;
        this.$store.commit(SET_POSTING, { index: this.index, posting: clone });
      },
    },
    amount: {
      get() {
        return this.$store.getters.transaction.postings[this.index].amount;
      },
      set(value) {
        let posting = this.$store.getters.transaction.postings[this.index];

        //let clone = structuredClone(posting);
        let clone = toRaw(posting);

        clone.amount = value;
        this.$store.commit(SET_POSTING, { index: this.index, posting: clone });
      },
    },
    currency: {
      get() {
        return this.$store.getters.transaction.postings[this.index].currency;
      },
      set(value) {
        let posting = this.$store.getters.transaction.postings[this.index];

        //let clone = structuredClone(posting);
        let clone = toRaw(posting);

        clone.currency = value;
        this.$store.commit(SET_POSTING, { index: this.index, posting: clone });
      },
    },
    isMissingCurrency: {
      get() {
        const hasValidAmount = !isNaN(this.amount);
        const amountMissing = this.amount === "";
        const hasNoCurrency = this.currency === "";

        if (amountMissing) return false;

        return hasNoCurrency && hasValidAmount;
      },
    },
  },

  methods: {
    onAmountFocus(e) {
      e.target.select();
    },
  },
};
</script>
