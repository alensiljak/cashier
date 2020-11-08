<template>
  <q-page padding class="bg-colour1 text-colour2">
    <stx-toolbar
      title="Scheduled Transactions"
      @backup-clicked="onBackupClicked"
      @restore-clicked="onRestoreClicked"
    />

    <div v-if="transactions.length === 0">
      There are no scheduled transactions
    </div>

    <q-list dark class="text-colour2">
      <q-item
        v-for="stx in transactions"
        :key="stx.id"
        v-ripple
        clickable
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
// import Toolbar from '../components/Toolbar'
import appService from '../appService'
import moment from 'moment'
import StxToolbar from '../components/ScheduledTxToolbar'

export default {
  components: {
    StxToolbar,
    // Toolbar,
  },

  data() {
    return {
      transactions: [],
      today: null,
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
    onBackupClicked() {
      this.$router.push({ name: 'export', params: { type: 'scheduled' }})
    },
    onFabClicked() {
      // reset any cached values
      this.$store.commit('saveToClipboard', null)
      this.$router.push({ name: 'scheduledtxeditor' })
    },
    onRestoreClicked() {
      this.$router.push({ name: 'restore', params: { type: 'scheduled' }})
    },
    showTx(id) {
      this.$router.push({ name: 'scheduledtxeditor', params: { id: id } })
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