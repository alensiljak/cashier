<template>
  <div class="form-row">
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
  </div>
</template>
<script>
export default {
    props: ['posting'],
    //['account', 'amount', 'currency'],
    data: function() {
        return {
            // account: null,
            // amount: null,
            // currency: null
        }
    }
};
</script>
