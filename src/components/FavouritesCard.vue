<template>
  <q-card dark bordered @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Favourites</q-card-section> -->
    <q-card-section class="bg-primary">
      <strong>Favourites</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="accounts.length === 0">
        There are no favourite accounts defined
      </div>

      <q-list>
        <q-item
          v-for="account in accounts"
          :key="account.name"
          class="q-px-none"
          dense
        >
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>
            {{ account.balance }} {{ account.currency }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
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
    onCardClick() {
      this.$emit('click')
    }
  },
}
</script>