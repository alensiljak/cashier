<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Asset Allocation Help'" />

    <h4>Asset Allocation Setup</h4>

    <p>
      To set up the Asset Allocation, the following information is required:
    </p>
    <ul>
      <li>Asset Allocation definition, import the file</li>
      <li>Link Stocks to Asset Classes - done in the AA definition file,</li>
      <li>import balances in common currency - via the sync function,</li>
      <li>Run 'Calculate'.</li>
    </ul>

    <h5>Asset Allocation Definition</h5>

    <p>
      The definition is stored in a Yaml file and uses the following structure
    </p>
    <pre>
        Allocation:
          allocation: 100.00
          Equity:
            allocation: 55.00
            Domestic:
              allocation: 24.00
              symbols: [VEUR]
            International:
              allocation: 31.00
              symbols: [VTI]
          Fixed:
            allocation: 30.00
            symbols: [VGB, VACF]
          Real:
            allocation: 12.00
            symbols: [VAP]
          Cash:
            allocation: 3.00
            symbols: [EUR, USD, AUD]
      </pre
    >

    <h5>Current Balances Calculation</h5>
    <p>read quantities and import the prices to calculate</p>
    <p>
      Note: To get quantities, set the root account and all the accounts
      underneath contain the balances.
    </p>

    <h5>Import Current Balances</h5>
    <p>
      It is simpler to import the balances from "ledger b &lt;root acct&gt; -X
      &lt;CUR&gt;".
    </p>
  </q-page>
</template>

<script lang="ts" setup>
import Toolbar from '../components/CashierToolbar.vue'
</script>
