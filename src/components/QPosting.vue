<template>
  <div>
    <div class="row">
      <!-- spacer -->
      <div class="col-1"></div>

      <div class="col">
        <!-- account -->
        <q-select
          clearable
          dark
          label="Account"
          use-input
          new-value-mode="add-unique"
          fill-input
          hide-selected
          popup-content-class="bg-grey-10 text-amber-2"
          :options="accountOptions"
          v-model="posting.account"
          @filter="filterAccounts"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No accounts</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-2"></div>
      <div class="col-3 col-xs-5">
        <!-- amount -->
        <q-input dark label="Amount" v-model.number="posting.amount" type="number"/>
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <!-- set from the account -->
        <q-input dark label="Currency" v-model="posting.currency"/>
      </div>
      <!-- operations / delete button -->
      <div class="col-1 flex flex-center">
        <q-btn
          color="secondary"
          text-color="accent"
          icon="delete"
          round
          size="sm"
          @click="deleteRow"
        />
      </div>
    </div>
  </div>
</template>

<script>
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
    deleteRow() {
      // todo confirm
      this.$emit("delete-row", this.index);
    },
    filterAccounts(val, update) {
      // val, update, abort

      update(() => {
        const needle = val.toLowerCase();
        this.accountOptions = this.accounts.filter(
          account => account.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '../styles/styles.scss';
// .q-qitem--active {
//   color: red;
// }
</style>
