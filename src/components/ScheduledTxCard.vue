<template>
  <q-card bordered @click="onCardClick">
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="calendar-alt" class="q-mr-sm" />
      <strong>Upcoming Transactions</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="list.length === 0">There are no scheduled transactions</div>

      <q-list>
        <q-item v-for="stx in list" :key="stx.id" dense class="q-px-none">
          <q-item-section side>
            <span
              :class="{
                red: stx.nextDate < today,
                yellow: stx.nextDate === today,
                green: stx.nextDate > today,
              }"
            >
              {{ stx.nextDate }}
            </span>
          </q-item-section>
          <q-item-section>
            {{ JSON.parse(stx.transaction).payee }}
          </q-item-section>
          <q-item-section side> n/a </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        outline
        color="primary"
        text-color="accent"
        @click.capture="onCalendarClick"
      >
        <font-awesome-icon icon="calendar-alt" class="q-icon-small on-left" />
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

const emit = defineEmits(['click'])

const router = useRouter()
const Notification = useNotifications()

const today: Ref<string> = ref('')
const list: Ref<any> = ref([])

onMounted(async () => {
  today.value = moment().format('YYYY-MM-DD')
  // load data
  await loadData()
})

async function loadData() {
  try {
    const schtxs = await appService.db.scheduled
      .orderBy('nextDate')
      .limit(5)
      .toArray()

    // add the transaction value?
    // TransactionAugmenter.

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
