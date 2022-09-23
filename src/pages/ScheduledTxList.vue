<template>
  <q-page padding class="text-colour2">
    <ScheduledTxToolbar
      title="Scheduled Transactions"
      @backup-clicked="onBackupClicked"
      @restore-clicked="onRestoreClicked"
      @filter-changed="onFilterChanged"
      @calendar-clicked="onCalendarClicked"
    />

    <div v-if="transactions.length === 0">
      There are no scheduled transactions
    </div>

    <q-list class="text-colour2">
      <!-- dense -->
      <q-item
        v-for="stx in filteredList"
        :key="stx.id"
        v-ripple
        clickable
        class="q-px-none"
        @click="showTx(stx.id)"
      >
        <!-- <q-item-label>Label</q-item-label> -->
        <q-item-section
          avatar
          :class="{
            red: stx.nextDate < today,
            yellow: stx.nextDate === today,
            green: stx.nextDate > today,
          }"
        >
          {{ stx.nextDate }}
        </q-item-section>
        <q-item-section>
          {{ JSON.parse(stx.transaction).payee }}
          <small class="remarks">{{ getFirstLine(stx.remarks) }}</small>
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <q-icon name="add" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'
import { useRoute, useRouter } from 'vue-router'
import appService from '../appService'
import moment from 'moment'
import ScheduledTxToolbar from '../components/ScheduledTxToolbar.vue'
import { computed, onMounted, Ref, ref } from 'vue'
import { ScheduledTransaction } from 'src/model'

const mainStore = useMainStore()
//const route = useRoute()
const router = useRouter()

const transactions = ref([])
const today: Ref<string | null> = ref(null)
const filter: Ref<string> = ref('')

onMounted(async () => {
  today.value = moment().format('YYYY-MM-DD')
  await loadData()
})

const filteredList = computed(() => {
  if (!filter.value) {
    return transactions.value
  }

  if (!transactions.value) return

  // apply the filter
  return transactions.value.filter((stx: ScheduledTransaction) => {
    const tx = JSON.parse(stx.transaction)
    //const result = (tx.payee.toUpperCase().indexOf(this.filter.toUpperCase()) > -1)

    // const result = stx.transaction.toUpperCase()
    //   .indexOf(this.filter.toUpperCase()) > -1

    // const result = stx.transaction.toLowerCase()
    //   .indexOf(this.filter.toLowerCase()) > -1

    // const result = stx.transaction
    //   .localeCompare(this.filter, undefined, { sensitivity: 'base' }) === 0

    // Use regex for performance.
    var searchTerm = new RegExp(filter.value, 'i')
    //const result = stx.transaction.match(searchTerm)
    const result = tx.payee.match(searchTerm)

    return result
  })
})

// methods

function onFabClicked() {
  // reset any cached values
  mainStore.newScheduledTx()
  mainStore.newTx()
  router.push({ name: 'scheduledtxeditor' })
}

/**
 * Gets only the first line of the text (until the first line break).
 */
function getFirstLine(text: string) {
  if (!text) return

  return text.split('\n')[0]
}

async function loadData() {
  let sorted = await appService.db.scheduled
    .orderBy('nextDate')
    //.sortBy('symbol')
    .toArray()

  // sort also by payee, case insensitive
  sorted.sort((a, b) => {
    const tx1 = JSON.parse(a.transaction)
    const tx2 = JSON.parse(b.transaction)

    var sorting = a.nextDate.localeCompare(b.nextDate)
    return sorting == 0
      ? tx1.payee.localeCompare(tx2.payee, 'en', { sensitivity: 'base' })
      : sorting
  })

  transactions.value = sorted
}

function onBackupClicked() {
  router.push({ name: 'export', params: { type: 'scheduled' } })
}

function onCalendarClicked() {
  router.push({ name: 'calendar' })
}

function onFilterChanged(value: string) {
  filter.value = value
}

function onRestoreClicked() {
  router.push({ name: 'restore', params: { type: 'scheduled' } })
}

async function showTx(id) {
  // load tx
  await mainStore.loadScheduledTx(id)
  await router.push({ name: 'scheduledtxactions', params: { id: id } })
}
</script>
<style lang="sass" scoped>
@import "../css/palette.scss"

.red
  color: $negative

.yellow
  color: $warning

.green
  color: $positive

.remarks
  color: $colour2
</style>
