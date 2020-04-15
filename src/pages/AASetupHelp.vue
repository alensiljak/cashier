<template>
  <q-page padding class="bg-colour1 text-colour2">
    <h4>Asset Allocation Setup</h4>

    <p>To set up the Asset Allocation, the following information is required:</p>
    <ul>
      <li>Asset Allocation definition, import the file</li>
      <li>Link Stocks to Asset Classes - done in the AA definition file,</li>
      <li>import balances in common currency - via the sync function,</li>
      <li>Run 'Calculate'.</li>
    </ul>

    <h5>Asset Allocation Definition</h5>
    <p>The definition file uses the following structure</p>
    <pre>
        Allocation                        100.00
        Allocation:Equity                  55.00
        Allocation:Equity:Domestic         24.00    VEUR
        Allocation:Equity:International    31.00    VTI
        Allocation:Fixed                   30.00    VGB
        Allocation:Real                    12.00    VAP
        Allocation:Cash                     3.00    EUR USD AUD
      </pre>

    <h5>Current Balances Calculation</h5>
    <p>read quantities and import the prices to calculate</p>
    <p>
      Note: To get quantities, set the root account and all the accounts underneath contain
      the balances.
    </p>

    <h5>Import Current Balances</h5>
    <p>It is simpler to import the balances from "ledger b &lt;root acct&gt; -X &lt;CUR&gt;".</p>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Asset Allocation Help");
  }
};
</script>
