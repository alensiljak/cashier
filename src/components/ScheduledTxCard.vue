<template>
  <q-card dark bordered class="my-card" @click="onScheduledClick">
    <q-card-section class="text-subtitle2">
      Upcoming Transactions
    </q-card-section>
    <q-card-section>
      <div v-if="list.length === 0">There are no scheduled transactions</div>

      <q-list dense>
        <q-item v-for="tx in list" :key="tx.id">
          <span class="q-mr-lg">{{ tx.nextDate }}</span>
          {{ tx.endDate }}
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
import appService from '../appService'

export default {
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.list = await appService.db.scheduled
          .orderBy('nextDate')
          .reverse()
          .limit(5)
          .toArray()
      } catch (error) {
        this.$q.notify({ color: 'secondary', message: error.message })
      }
    },
  },
}
</script>