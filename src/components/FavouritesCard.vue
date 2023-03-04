<template>
  <q-card bordered @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Favourites</q-card-section> -->

    <q-card-section class="bg-primary q-pa-sm">
      <Star class="icon q-mr-sm" size=20 />
      <strong>Favourites</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="accounts.length === 0">
        There are no favourite accounts defined
      </div>

      <q-list>
        <q-item v-for="account in accounts" :key="account.name" class="q-px-none" dense>
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>
            {{ getBalance(account).amount }} {{ getBalance(account).currency }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'
import appService from '../appService'
import { TransactionAugmenter } from 'src/lib/transactionAugmenter'
import { Account } from 'src/model'
import { Star } from 'lucide-vue-next'
import { AccountService } from '../lib/accountsService'
import { SettingKeys, settings } from 'src/lib/settings'

const $q = useQuasar()
const accountService = new AccountService()

const emit = defineEmits(['click'])

// data
const accounts: Ref<Account[]> = ref([])
let defaultCurrency: string

// methods

onMounted(async () => {
  loadData()
})

function getBalance(account: Account) {
  return accountService.getAccountBalance(account, defaultCurrency)
}

async function loadData() {
  defaultCurrency = await settings.get(SettingKeys.currency)

  try {
    let favArray = await appService.loadFavouriteAccounts()
    if (!favArray) {
      console.log('no favourite accounts selected yet')
      return
    }

    // Use only the top 5 records.
    favArray = favArray.slice(0, 5)

    // adjust the balance
    const augmenter = new TransactionAugmenter()
    favArray = await augmenter.adjustAccountBalances(favArray)

    accounts.value = favArray
  } catch (error: any) {
    console.error(error)
    $q.notify({ color: 'secondary', message: error.message })
  }
}

function onCardClick() {
  emit('click')
}
</script>
