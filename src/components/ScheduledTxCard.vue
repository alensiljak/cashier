<template>
  <q-card bordered @click="onCardClick">
    <q-card-section class="bg-primary q-pa-sm">
      <calendar-clock class="icon q-mr-sm" size="1.4em" />
      <strong>Upcoming Transactions</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="list.length === 0">There are no scheduled transactions</div>

      <q-list>
        <q-item v-for="stx in list" :key="stx.id" dense class="q-px-none">
          <q-item-section side>
            <span :class="{
              red: stx.nextDate < today,
              yellow: stx.nextDate === today,
              green: stx.nextDate > today,
            }">
              {{ stx.nextDate }}
            </span>
          </q-item-section>
          <q-item-section>
            {{ stx.transaction.payee }}
          </q-item-section>
          <q-item-section side>{{ stx.transaction.amount }} </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn outline color="primary" text-color="accent" @click.capture="onCalendarClick">
        <calendar-days size="20" class="on-left" />
        Calendar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import moment, { Moment } from 'moment'
import { useRouter } from 'vue-router'
import useNotifications from 'src/lib/CashierNotification'
import appService from '../appService'
import { TransactionAugmenter } from 'src/lib/transactionAugmenter'
import { ScheduledTransaction, Transaction } from 'src/model'
import { TransactionParser } from 'src/lib/transactionParser'
import { CalendarClock, CalendarDays } from 'lucide-vue-next'

const emit = defineEmits(['click'])

const router = useRouter()
const Notification = useNotifications()

const today: Ref<string> = ref('')
const list: Ref<any> = ref([])
//const transactions: Ref<Array<Transaction>> = ref([])

onMounted(async () => {
  today.value = moment().format('YYYY-MM-DD')
  // load data
  await loadData()
})

async function loadData() {
  try {
    const schtxs: ScheduledTransaction[] = await appService.db.scheduled
      .orderBy('nextDate')
      .limit(5)
      .toArray()

    // add the transaction amounts.
    let txs = schtxs.map((schtx) => schtx.transaction)
    TransactionParser.calculateTxAmounts(txs)

    list.value = schtxs
  } catch (error: any) {
    console.error(error)
    Notification.negative(error.message)
  }
}

function onCalendarClick() {
  //this.$emit('calendar-click')
  router.push({ name: 'calendar' })
}

function onCardClick() {
  emit('click')
}
</script>
<style lang="sass" scoped>
.red
  color: $negative

.yellow
  color: $warning

.green
  color: $positive
</style>
