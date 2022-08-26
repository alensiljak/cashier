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
        :model-value="accounts"
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
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// data
const accounts = ref([])

onMounted(async () => {
  //
  await loadData()
})

async function loadData() {
  const records = await appService.loadFavouriteAccounts()
  // load account details
  if (!records) {
    console.log('no favourite accounts selected yet')
    return
  }

  try {
    accounts.value = records
  } catch (error) {
    $q.notify({ color: 'secondary', message: error.message })
  }
}

function onListChange(list) {
  accounts.value = list
}

async function onSaveClick() {
  // get the list of account names
  const names = accounts.value.map((account) => account.name)

  await settings.set(SettingKeys.favouriteAccounts, names)

  await loadData()
  $q.notify('Favourites reordered')
}
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
}
</script>
