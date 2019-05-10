<template>
  <div class="form-row mb-1">
    <!-- spacer -->
    <div class="col-1"></div>
    
    <!-- account -->
    <div class="col">
      <input type="text" class="form-control" v-model="posting.account">
    </div>
    
    <!-- amount -->
    <div class="col-2">
      <input type="number" class="form-control" v-model="posting.amount">
    </div>
    
    <!-- currency -->
    <div class="col-1">
      <input type="text" class="form-control" v-model="posting.currency">
    </div>

    <!-- operations -->
    <div class="col-1 text-center my-auto">
      <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteRow">
        <font-awesome-icon icon="trash-alt" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
    props: ['posting', 'index'],
    //['account', 'amount', 'currency'],
    data: function() {
        return {
            // account: null,
            // amount: null,
            // currency: null
        }
    },
    methods: {
      deleteRow: function(event) {
        // todo confirm
        this.$emit('delete-row', this.index)
      }
    }
};
</script>
