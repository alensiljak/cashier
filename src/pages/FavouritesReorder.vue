<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Reorder Favourites'">
      <q-btn flat round dense icon="check" @click="onSaveClicked" />
    </toolbar>

    <!-- <accounts-list
      axis="y"
      v-model:list="accounts"
      lock-axis="y"
      :value="accounts"
      :list="accounts"
    >
      <account-item
        v-for="(account, index) in accounts"
        :key="account"
        :index="index"
        :account="account"
        @input="onListChange"
      />
    </accounts-list> -->

    <!--  @update:list="onListUpdated" -->
    <SlickList
      axis="y"
      v-model:list="accounts"
      :value="accounts"
      :list="accounts"
    >
      <SlickItem
        v-for="(account, i) in accounts"
        :key="account"
        :index="i"
        class="long-list"
      >
        <q-item v-ripple clickable class="list-item">
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>
            {{ account.balance }} {{ account.currency }}
          </q-item-section>
        </q-item>
      </SlickItem>
    </SlickList>

    <!-- <div class="row q-my-xl justify-end">
      <q-btn
        color="secondary"
        text-color="accent"
        label="Save"
        @click="onSaveClicked"
      />
    </div> -->
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import Toolbar from '../components/CashierToolbar.vue'
// import AccountsList from '../components/SortableAccountsList.vue'
// import AccountItem from '../components/SortableAccountItem.vue'
import { settings, SettingKeys } from '../lib/Configuration'
import appService from '../appService'
import { SlickList, SlickItem } from 'vue-slicksort'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

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

async function onSaveClicked() {
  // get the list of account names
  const names = accounts.value.map((account) => account.name)

  await settings.set(SettingKeys.favouriteAccounts, names)

  await loadData()
  $q.notify('Favourites reordered')

  //router.push({ name: 'favourites' })
  router.back()
}
</script>

<style scoped>
.long-list {
  max-height: 300px;
  overflow: auto;
}
</style>