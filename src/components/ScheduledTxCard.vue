<template>
  <q-card dark bordered @click="onCardClick">
    <q-card-section class="q-pb-none"> Upcoming Transactions </q-card-section>
    <q-card-section>
      <div v-if="list.length === 0">There are no scheduled transactions</div>

      <q-list>
        <q-item v-for="stx in list" :key="stx.id" dense class="q-px-none">
          <span
            class="q-mr-lg"
            :class="{
              red: stx.nextDate < today,
              yellow: stx.nextDate === today,
            }"
          >
            {{ stx.nextDate }}</span>
          {{ JSON.parse(stx.transaction).payee }}
          <!-- <span side>{{ stx.endDate }}</span> -->
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
import appService from '../appService'
import moment from 'moment'

export default {
  data() {
    return {
      list: [],
      today: null
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
    onCardClick() {
      this.$emit('click')
    },
  },
}
</script>
<style lang="sass" scoped>
.red
  color: $red-10

.yellow
  color: yellow
</style>