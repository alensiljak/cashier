<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Reorder Favourites'" />

    <accounts-list v-model="accounts" lock-axis="y">
      <account-item
        v-for="(account, index) in accounts"
        :key="index"
        :index="index"
        :account="account"
      />
    </accounts-list>

    <div class="row q-my-xl justify-end">
      <q-btn
        color="secondary"
        text-color="accent"
        label="Save"
        @click="onSaveClick"
      />
    </div>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import AccountsList from '../components/SortableAccountsList'
import AccountItem from '../components/SortableAccountItem'
import { settings, SettingKeys } from '../lib/Configuration'
import appService from '../appService'

export default {
  components: {
    AccountsList,
    AccountItem,
    Toolbar
  },
  data() {
    return {
      accounts: []
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const favArray = await settings.get(SettingKeys.favouriteAccounts)
      // load account details
      if (!favArray) {
        console.log('no favourite accounts selected yet')
        return
      }

      try {
        const accounts = await appService.db.accounts.bulkGet(favArray)
        this.accounts = accounts
      } catch (error) {
        this.$q.notify({ color: 'secondary', message: error.message })
      }
    },
    async onSaveClick() {
      // get the list of account names
      let names = []
      for (let i = 0; i < this.accounts.length; i++) {
        names.push(this.accounts[i].name)
      }

      await settings.set(SettingKeys.favouriteAccounts, names)
      await this.loadData()
      this.$q.notify('data saved')
    }
  }
}
</script>
