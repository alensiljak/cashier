<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Scheduled Transactions'" />

    <div v-if="transactions.length === 0">
      There are no scheduled transactions
    </div>

    <q-list dark>
      <q-item
        v-for="stx in transactions"
        :key="stx.id"
        v-ripple
        clickable
        @click="showTx(stx.id)"
      >
        <!-- <q-item-label>Label</q-item-label> -->
        <q-item-section avatar :class="{ red: stx.nextDate < today, yellow: stx.nextDate === today }">
          {{ stx.nextDate }}
        </q-item-section>
        <q-item-section>
          {{ JSON.parse(stx.transaction).payee }}
        </q-item-section>
        <q-item-section side>
          <!-- top -->
          >
          <!-- <q-item-label caption>Skip</q-item-label>
          <q-item-label caption>Post</q-item-label> -->
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import Toolbar from '../components/Toolbar'
import appService from '../appService'
import moment from 'moment'

export default {
  components: {
    Toolbar,
  },

  data() {
    return {
      transactions: [],
      today: null
    }
  },

  created() {
    this.today = moment().format('YYYY-MM-DD')
    this.loadData()
  },

  methods: {
    async loadData() {
      this.transactions = await appService.db.scheduled
        .orderBy('nextDate')
        .toArray()
    },
    onFabClicked() {
      this.$router.push({ name: 'scheduledtxeditor' })
    },
    showTx(id) {
      this.$router.push({ name: 'scheduledtxeditor', params: { id: id } })
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