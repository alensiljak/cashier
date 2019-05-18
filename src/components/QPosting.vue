<template>
  <div>
    <div class="row">
      <!-- spacer -->
      <div class="col-1"></div>

      <div class="col">
        <!-- account -->
        <q-input dark label="Account" v-model="posting.account"/>
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-1"></div>
      <div class="col-3 col-xs-5">
        <!-- amount -->
        <q-input dark label="Amount" v-model.number="posting.amount"/>
      </div>
      <div class="col-3 col-xs-5">
        <!-- currency -->
        <!-- set from the account -->
        <q-input dark label="Currency" v-model="posting.currency"/>
      </div>
      <!-- operations / delete button -->
      <div class="col-1 flex flex-center">
        <q-btn color="secondary" text-color="accent" icon="delete" round size="sm"
          @click="deleteRow"/>
      </div>
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
