<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Display the chart of accounts with balances and currencies. Selecting one opens the register.</p>
    <p>The list should be customizable by selecting which accounts to show (favourite).</p>

    <q-tree color="colour2" text-color="amber-2" dark :nodes="simple" node-key="label"/>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" text-color="secondary" v-on:click="openNewTransaction"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";

export default {
  data() {
    return {
      simple: [
        {
          label: 'Chart of accounts',
          avatar: '/img/icons/favicon-32x32.png',
          children: [
            {
              label: 'Dining',
              icon: 'restaurant_menu',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Lodging',
              icon: 'room_service',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Bank Accounts',
              icon: 'account_balance',
              children: [
                {
                  label: 'Checking',
                  img: 'https://cdn.quasar-framework.org/img/logo_calendar_128px.png'
                },
                { label: 'Good table presentation' },
                { label: 'Investment', icon: 'assessment' }
              ]
            }
          ]
        }
      ]
    }
  },
  created() {
    this.$store.commit(SET_TITLE, "Balance Sheet");
  },
  methods: {
    openNewTransaction() {
      this.$router.push({ name: "newTransaction" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/styles.scss'

// .colour2 {
//   color: $colour2;
// }
</style>
