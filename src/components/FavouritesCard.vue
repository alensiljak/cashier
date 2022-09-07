<template>
  <q-card dark bordered @click="onCardClick">
    <!-- <q-card-section class="text-subtitle2">Favourites</q-card-section> -->

    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="star" class="q-mr-sm" />
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

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { settings, SettingKeys } from '../lib/Configuration'
import appService from '../appService'

const $q = useQuasar()

const emit = defineEmits(['click'])

// data
const accounts = ref([])

// methods

onMounted(async () => {
  loadData()
})

async function loadData() {
  try {
    let favArray = await appService.loadFavouriteAccounts()
    if (!favArray) {
      console.log('no favourite accounts selected yet')
      return
    }

    // Use only the top 5 records.
    favArray = favArray.slice(0, 5)

    // adjust the balance
    //accounts = await this.adjustBalances(accounts)
    accounts.value = favArray
  } catch (reason) {
    $q.notify({ color: 'secondary', message: reason.message })
  }
}

function onCardClick() {
  emit('click')
}
</script>
