<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'Reorder Favourites'">
      <q-btn flat round dense @click="onSaveClicked">
        <check />
      </q-btn>
    </toolbar>

    <draggable tag="q-list" :list="accounts" class="list-group" handle=".handle" item-key="name">
      <template #item="{ element }">
        <q-item v-ripple clickable class="list-item">
          <q-item-section side class="handle">
            <icon-menu left />
          </q-item-section>
          <q-item-section>{{ element.name }}</q-item-section>
          <!-- <q-item-section side>
            {{ element.balance }} {{ element.currency }}
          </q-item-section> -->
        </q-item>
      </template>
    </draggable>

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
    <!-- <SlickList
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
    </SlickList> -->

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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import Toolbar from '../components/CashierToolbar.vue'
import { settings, SettingKeys } from '../lib/settings'
import appService from '../appService'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import useNotifications from 'src/lib/CashierNotification'
import { Check, Menu as IconMenu } from 'lucide-vue-next'

const $q = useQuasar()
const router = useRouter()
const Notification = useNotifications()

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
  Notification.positive('Favourites reordered')

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