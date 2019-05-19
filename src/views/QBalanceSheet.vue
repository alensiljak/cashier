<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <p>Display the chart of accounts with balances and currencies. Selecting one opens the register.</p>
    <p>The list should be customizable by selecting which accounts to show (favourite).</p>

    <q-tree dark :nodes="simple" node-key="label"/>

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
          label: 'Satisfied customers (with avatar)',
          avatar: 'https://cdn.quasar-framework.org/img/boy-avatar.png',
          children: [
            {
              label: 'Good food (with icon)',
              icon: 'restaurant_menu',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service (disabled node with icon)',
              icon: 'room_service',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings (with icon)',
              icon: 'photo',
              children: [
                {
                  label: 'Happy atmosphere (with image)',
                  img: 'https://cdn.quasar-framework.org/img/logo_calendar_128px.png'
                },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
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
