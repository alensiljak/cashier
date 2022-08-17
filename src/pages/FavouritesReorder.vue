<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Reorder Favourites'" />

    <accounts-list v-model:list="accounts" lock-axis="y">
      <account-item
        v-for="(account, index) in accounts"
        :key="account"
        :index="index"
        :account="account"
        :value="accounts"
        :modelValue="accounts"
        @input="onListChange"
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

<script setup>
// import { onMounted } from 'vue'

// onMounted(async () => {
//   //
// })
</script>
<script>
import Toolbar from '../components/CashierToolbar.vue'
import AccountsList from '../components/SortableAccountsList.vue'
import AccountItem from '../components/SortableAccountItem.vue'
import { settings, SettingKeys } from '../lib/Configuration'
import appService from '../appService'

export default {
  components: {
    AccountsList,
    AccountItem,
    Toolbar,
  },
  data() {
    return {
      accounts: [],
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      const accounts = await appService.loadFavouriteAccounts()
      // load account details
      if (!accounts) {
        console.log('no favourite accounts selected yet')
        return
      }

      try {
        this.accounts = accounts
      } catch (error) {
        this.$q.notify({ color: 'secondary', message: error.message })
      }
    },

    onListChange(list) {
      this.accounts = list
    },

    async onSaveClick() {
      // get the list of account names
      let names = []
      for (let i = 0; i < this.accounts.length; i++) {
        names.push(this.accounts[i].name)
      }

      await settings.set(SettingKeys.favouriteAccounts, names)
      await this.loadData()
      this.$q.notify('Favourites reordered')
    },
  },
}
</script>
