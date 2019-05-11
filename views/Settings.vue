<template>
  <div>
    <h1>Settings</h1>
    <div>
      <p>Load an initial balance sheet, providing the accounts list, balance amounts,
        and commodities/currencies</p>
      <button type="button" class="btn btn-secondary" v-on:click="loadBalanceSheet">
        Load Balance Sheet</button>
    </div>
  </div>
</template>
<script>
export default {
data: function() {
    return {
      test: null,
    };
  },  
  methods: {
    loadBalanceSheet() {
      console.log('test')
    },
    test2() {
      console.log('2')
    }
  }
}
</script>
