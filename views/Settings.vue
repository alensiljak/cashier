<template>
  <div>
    <h1>Settings</h1>
    <div>
      <p>
        Load an initial balance sheet, providing the accounts list, balance amounts,
        and commodities/currencies
      </p>
      <button
        type="button"
        class="btn btn-secondary"
        v-on:click="loadBalanceSheet"
      >Load Balance Sheet</button>
    </div>

    <div class="mt-3">
      <p>Load payees from Ledger. Export with "ledger payees".</p>
      <div class="form-row">
        <div class="col">
          <input id="payeesFile" class="form-control-file" type="file">
        </div>
        <button type="button" class="btn btn-secondary" v-on:click="onLoadPayees">Load Payees</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      test: null
    };
  },
  methods: {
    loadBalanceSheet() {
      console.log("test");
    },
    test2() {
      console.log("2");
    },
    onLoadPayees() {
      // todo enable uploading payee list
      fetch('payeesFile')
        .then(r => r.text())
        .then(t => console.log(t))
    }
  }
};
</script>
