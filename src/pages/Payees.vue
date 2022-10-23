<template>
  <q-page padding class="text-colour2">
    <payees-toolbar title="Payees" :filter="filter" @filter="onFilter" @menu-clicked="onMenuClicked" />

    <RecycleScroller v-slot="{ item }" page-mode class="scroller" :items="payees" :item-size="42" key-field="name">
      <div class="scroller-item" @click="itemClicked(item.name)">
        <div class="scroller-item-content">
          {{ item.name }}
        </div>
      </div>
    </RecycleScroller>

    <!-- <q-list>
      <q-item v-for="payee in payees" :key="payee">
        <q-item-section>{{ payee }}</q-item-section>
      </q-item>
    </q-list> -->

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onAcceptClick">
        <icon-check />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/mainStore'
import { useStore } from 'vuex'
import { CashierSync } from '../lib/syncCashier'
import { Constants, settings, SettingKeys } from '../lib/settings'
// import appService from '../appService'
import { SET_SELECTED_ID } from '../mutations'
import PayeesToolbar from '../components/PayeesToolbar.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import useNotifications from 'src/lib/CashierNotification'
import CashierDAL from 'src/store/dal'
import { Payee } from 'src/model'
import { ListSearch } from 'src/ListSearch'
import { Check as IconCheck } from 'lucide-vue-next'

const $router = useRouter()
const mainStore = useMainStore()
const store = useStore()
const Notification = useNotifications()

const payees: Ref<Payee[]> = ref([])
const filter: Ref<string | undefined> = ref(undefined)
const newPayee = ref(null)
const addDialogVisible = ref(false)

onMounted(async () => {
  try {
    await loadData()
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }
})

/**
 * Currently we only use click for selecting a Payee in a Transaction.
 * In standalone page, ignore the event.
 */
function itemClicked(id: string) {
  // select the item and return to the caller.
  let meta = store.state.selectModeMeta

  if (!meta) return

  if (meta.selectionType !== 'payee') {
    throw 'Invalid selection mode!'
  }

  store.commit(SET_SELECTED_ID, id)

  // Simply go back, assuming that the previous page is requesting the data.
  $router.back() // .go(-1)
}

async function loadData() {
  const dal = new CashierDAL()
  const payeeRecords = await dal.loadPayees().toArray()

  // Apply filter
  if (filter.value) {
    let search = new ListSearch()
    let regex = search.getRegex(filter.value)

    payees.value = payeeRecords.filter((payee) => regex.test(payee.name))
  } else {
    payees.value = payeeRecords
  }
}

function onAcceptClick() {
  itemClicked(filter.value as string)
}

// function onAddPayee() {
//   if (!newPayee.value) return

//   addDialogVisible.value = false

//   appService.addPayee(newPayee.value).then(() => {
//     // clear the "new payee" name for a new entry
//     newPayee.value = null
//     loadData()
//   })
// }

async function onFilter(text: string) {
  filter.value = text
  await loadData()
}

function onMenuClicked() {
  mainStore.toggleDrawer()
}
</script>

<style lang="scss" scoped>
.scroller {
  height: 100%;
}

.scroller-item {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.scroller-item-content {
  flex-grow: 1;
}

.scroller-item-action {
  text-align: right;
}
</style>