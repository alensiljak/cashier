<template>
  <q-card dark bordered @click="onCardClick">
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="calendar-alt" class="q-mr-sm" />
      <strong>Upcoming Transactions</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="list.length === 0">There are no scheduled transactions</div>

      <q-list>
        <q-item v-for="stx in list" :key="stx.id" dense class="q-px-none">
          <span
            class="q-mr-lg"
            :class="{
              red: stx.nextDate < today,
              yellow: stx.nextDate === today,
              green: stx.nextDate > today,
            }"
          >
            {{ stx.nextDate }}
          </span>
          {{ JSON.parse(stx.transaction).payee }}
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        outline
        dark
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

<script>
import appService from '../appService'
import moment from 'moment'

//emits:

export default {
  data() {
    return {
      list: [],
      today: null,
    }
  },
  created() {
    this.today = moment().format('YYYY-MM-DD')
    this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.list = await appService.db.scheduled
          .orderBy('nextDate')
          .limit(5)
          .toArray()
      } catch (error) {
        this.$q.notify({ color: 'secondary', message: error.message })
      }
    },
    onCalendarClick() {
      //this.$emit('calendar-click')
      this.$router.push({ name: 'calendar' })
    },
    onCardClick() {
      this.$emit('click')
    },
  },
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
