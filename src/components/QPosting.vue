<template>
  <div>
    <div class="row">
      <!-- spacer -->
      <div class="col-1"></div>

      <div class="col text-amber-2">
        <!-- account -->
        <q-select clearable dark label="Account" use-input fill-input hide-selected
          popup-content-class="bg-teal-9 text-amber-2"
          :options="accountOptions" v-model="posting.account" @filter="filterAccounts" />

        <q-input dark label="Account" v-model="posting.account"/>
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-2"></div>
      <div class="col-3 col-xs-5">
        <!-- amount -->
        <q-input dark label="Amount" v-model.number="posting.amount" input-class="text-right"/>
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
  props: ["posting", "index", 'accounts'],

  data: function() {
    return {
      accountOptions: []
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
    filterAccounts(val, update, abort) {
      console.log('filtering', val, update, abort)
      update(() => {
        const needle = val.toLowerCase()
        this.accountOptions = this.accounts.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '../styles/styles.scss';
.q-qitem--active {
  color: red;
}
</style>
