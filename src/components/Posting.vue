<template>
  <div>
    <div class="row">
      <!-- spacer -->
      <div class="col-1" />

      <div class="col">
        <!-- Account -->
        <q-input v-model="posting.account" dark label="Account" @click="$emit('accountClicked')" />
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-2" />
      <div class="col-3 col-xs-5">
        <!-- Amount -->
        <q-input
          v-model.number="posting.amount"
          dark
          label="Amount"
          type="number"
          input-class="text-right"
          @change="$emit('amountChanged')"
        />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <!-- set from the account -->
        <q-input v-model="posting.currency" dark label="Currency" />
      </div>
    </div>
  </div>
</template>

<script>
import appService from "../appService";

export default {
  props: ["posting", "index", "accounts"],

  data: function() {
    return {
      accountOptions: null
    };
  },

  created() {
    // console.log(this.accounts)
  },

  methods: {
    filterAccounts(val, update) {
      // val, update, abort

      update(() => {
        const needle = val.toLowerCase();
        this.accountOptions = this.accounts.filter(
          account => account.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    onAccountSelected(name) {
      // console.log(name)
      // load account by name
      appService.db.accounts.get({ name: name }).then(account => {
        // console.log(account.currency)
        this.posting.currency = account.currency;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '../css/styles.scss';
// .q-qitem--active {
//   color: red;
// }
</style>
