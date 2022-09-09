<template>
  <q-card dark bordered>
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
      <q-btn color="accent" text-color="secondary" @click="onRestoreClick">
        Restore
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'
import useNotifications from 'src/lib/CashierNotification'
import appService from '../appService'

const { favourites: backup } = useCloudBackup()
const Notification = useNotifications()

// data
const accounts = ref([])
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

function onBackupClick() {
  Notification.positive('backup')
}

function onRestoreClick() {
  Notification.negative('restore')
}
</script>