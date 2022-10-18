<template>
  <q-card bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <calendar-clock size="20" class="icon q-mr-sm" />
      <strong>Scheduled Transactions</strong>
    </q-card-section>

    <q-card-section>
      <div>
        Total backups: {{ backupsCount }} <br />
        Last backup: {{ lastBackupFilename }}.
      </div>
    </q-card-section>

    <q-card-section>
      <div v-if="localTxCount === 0">There are no local transactions.</div>
      <div v-if="localTxCount > 0">
        There are {{ localTxCount }} local transactions.
      </div>
    </q-card-section>

    <!-- buttons -->
    <q-card-section class="text-center">
      <q-btn color="primary" text-color="accent" @click="onBackupClick" class="q-mr-lg" v-if="localTxCount > 0">
        Backup
      </q-btn>
      <!-- <q-btn color="accent" text-color="secondary" @click="onRestoreClick" v-if="backupsCount > 0">
        Restore
      </q-btn> -->
    </q-card-section>
  </q-card>
</template>
  
<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'
import db from 'src/store/indexedDb';
import useNotifications from 'src/lib/CashierNotification'
import { CalendarClock } from 'lucide-vue-next'

const { scheduledTxBackup: backup } = useCloudBackup()
const Notification = useNotifications()

const lastBackupFilename = ref('n/a')
const lastBackupFileId: Ref<any> = ref(null)
const backupsCount = ref(0)
const localTxCount = ref(0)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  backupsCount.value = await backup.getRemoteBackupCount()

  //let latest = await backup.getLatestFilename()
  let latest = await backup.getLatestFile()
  if (!latest) {
    latest = {
      name: '',
      fileid: 0
    }
  }
  lastBackupFilename.value = latest.name
  lastBackupFileId.value = latest.fileid

  // local transactions
  localTxCount.value = await db.scheduled.count()
}

async function onBackupClick() {
  // get the JSON data for export
  const records = await db.scheduled.toArray()
  const output = JSON.stringify(records)

  await backup.backup(output)

  Notification.positive('Settings backed up to the cloud.')

  await loadData()
}

function onRestoreClick() { }
</script>