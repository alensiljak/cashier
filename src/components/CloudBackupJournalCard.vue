<template>
  <q-card bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="star" class="q-mr-sm" />
      <strong>Journal</strong>
    </q-card-section>

    <q-card-section>
      <div>
        Last backup: {{ lastBackupTimestamp }}. Total backups:
        {{ backupsCount }}
      </div>
    </q-card-section>

    <q-card-section>
      <div v-if="localTxCount === 0">There are no local transactions.</div>
      <div v-if="localTxCount > 0">
        There are {{ localTxCount }} local transactions.
      </div>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn
        v-if="localTxCount > 0"
        color="primary"
        text-color="accent"
        @click="onBackupClick"
        class="q-mr-lg"
      >
        Backup
      </q-btn>
      <!-- <q-btn
        color="accent"
        text-color="secondary"
        @click="onRestoreClick"
        v-if="backupsCount > 0"
      >
        Restore
      </q-btn> -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'
import useNotifications from 'src/lib/CashierNotification'
import appService from '../appService'

const { journal: backup } = useCloudBackup()
const Notification = useNotifications()

// data
const lastBackupTimestamp = ref('n/a')
const backupsCount = ref(0)
const localTxCount = ref(0)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  // check local transactions
  localTxCount.value = await appService.db.transactions.count()

  // fetch remote backups
  backupsCount.value = await backup.getRemoteBackupCount()
}

async function onBackupClick() {
  // get the content
  const output = await appService.getExportTransactions()

  await backup.backup(output)
  Notification.positive('Journal backed up to the cloud.')

  await loadData()
}

function onRestoreClick() {
  Notification.negative('restore not implemented yet')
}
</script>