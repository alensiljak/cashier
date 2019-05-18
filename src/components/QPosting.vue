<template>
  <div class="row mb-1">
    <!-- spacer -->
    <div class="col-1"></div>

    <!-- account -->
    <q-input dark label="Account" v-model="test" />
    <div class="col-md">
      <input type="text" class="form-control" placeholder="account" v-model="posting.account">
    </div>

    <div class="col-1 d-sm-none"></div>

    <!-- amount -->
    <q-input dark label="Amount" v-model="posting.amount" />
    <div class="col-6 col-md-2">
      <input class="form-control text-right" placeholder="amount" v-mask="'numeric'"
      v-model="posting.amount">
    </div>

    <!-- currency -->
    <!-- set from the account -->
    <div class="col-5 col-md-1">
      <input type="text" class="form-control" placeholder="currency" v-model="posting.currency">
    </div>

    <div class="col-10 d-sm-none"></div>

    <!-- operations -->
    <div class="col-1 text-center my-auto">
      <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteRow">
        <!-- <font-awesome-icon icon="trash-alt"/> -->
        <q-icon name="delete" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["posting", "index"],
  data: function() {
    return {
      test: null
      // account: null,
      // amount: null,
      // currency: null
    };
  },
  methods: {
    deleteRow: function() {
      // todo confirm
      this.$emit("delete-row", this.index);
    }
  }
};
</script>
