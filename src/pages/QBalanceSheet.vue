<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Balance Sheet'" />

    <p>
      Display the chart of accounts with balances and currencies. Selecting one
      opens the register.
    </p>
    <p>
      The list should be customizable by selecting which accounts to show
      (favourite).
    </p>

    <q-tree
      color="colour2"
      text-color="amber-2"
      dark
      :nodes="simple"
      node-key="label"
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="accent"
        text-color="secondary"
        @click="openNewTransaction"
      >
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import Toolbar from '../components/CashierToolbar.vue'

export default {
  components: {
    Toolbar,
  },
  data() {
    return {
      simple: [
        {
          label: 'Chart of accounts',
          avatar: '/icons/favicon-32x32.png',
          children: [
            {
              label: 'Dining',
              icon: 'restaurant_menu',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' },
              ],
            },
            {
              label: 'Lodging',
              icon: 'room_service',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' },
              ],
            },
            {
              label: 'Bank Accounts',
              icon: 'account_balance',
              children: [
                {
                  label: 'Checking',
                  img: 'https://cdn.quasar-framework.org/img/logo_calendar_128px.png',
                },
                { label: 'Good table presentation' },
                { label: 'Investment', icon: 'assessment' },
              ],
            },
          ],
        },
      ],
    }
  },

  created() {},

  methods: {
    openNewTransaction() {
      this.$router.push({ name: 'tx' })
    },
  },
}
</script>
