<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <p>
      Nothing to see here yet but this should be the starting view,
      displaying the chart of (selected) accounts with balances and currencies.
    </p>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" v-on:click="openNewTransaction" />
      <!-- :to="{name:'newTransaction'}" -->
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  methods: {
    openNewTransaction() {
      this.$router.push({name:'newTransaction'})
    }
  }
}
</script>
