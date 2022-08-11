<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <toolbar :title="'Asset Allocation Help'" />

    <h4>Asset Allocation</h4>

    <p>
      Asset Allocation displays the allocation of your investments in the given
      Asset Classes.
    </p>
    <p>For this to work, you need the following:</p>
    <ul>
      <li>Import accounts; this provide currencies/commodities</li>
      <li>
        Import asset allocation definition, with set percentages and stocks
      </li>
      <li>Import current balances</li>
    </ul>
    <p>To import the required data, see the AA Setup and Import pages.</p>
    <p>
      Accounts and asset allocation definition usually would need to be imported
      only once, or after a change.
    </p>
    <p>
      The current values, on the other hand, need to be imported every time the
      prices change.
    </p>
  </q-page>
</template>

<script>
import Toolbar from "../components/CashierToolbar.vue";

export default {
  components: {
    Toolbar,
  },
  created() {},
};
</script>
