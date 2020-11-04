<template>
  <div>
    <q-list dense>
      <q-item v-for="account in accounts" :key="account.name">
        <q-item-section>{{ account.name }}</q-item-section>
        <q-item-section side>
          {{ account.balance }} {{ account.currency }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { settings, SettingKeys } from '../lib/Configuration'
import appService from '../appService'

export default {
  data() {
    return {
      accounts: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      try {
        let favArray = await settings.get(SettingKeys.favouriteAccounts)
        if (!favArray) {
          console.log('no favourite accounts selected yet')
          return
        }

        // Use only the top 5 records.
        favArray = favArray.slice(0, 5)

        // load account details
        let accounts = await appService.db.accounts.bulkGet(favArray)
        // adjust the balance
        //accounts = await this.adjustBalances(accounts)
        this.accounts = accounts
      } catch (reason) {
        this.$q.notify({ color: 'red-10', message: reason.message })
      }
    },
  },
}
</script>