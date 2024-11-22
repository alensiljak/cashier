<template>
  <q-card bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <scroll size="20" class="icon q-mr-sm" />
      <strong>Journal</strong>
    </q-card-section>

    <q-card-section>
      <div>
        Total backups: {{ backupsCount }} <br />
        Last backup: {{ lastBackupFilename }}
      </div>
    </q-card-section>

    <q-card-section>
      <div v-if="localTxCount === 0">There are no local transactions.</div>
      <div v-if="localTxCount > 0">
        There are {{ localTxCount }} local transactions.
      </div>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn v-if="localTxCount > 0" color="primary" text-color="accent" @click="onBackupClick" :disable="isUploading"
        class="q-mr-lg">
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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'
import useNotifications from 'src/lib/Notifier'
import appService from '../appService'
import { Scroll } from 'lucide-vue-next'

const { journal: backup } = useCloudBackup()
const Notification = useNotifications()

// data
const backupsCount = ref(0)
const localTxCount = ref(0)
const lastBackupFilename = ref('n/a')
const lastBackupFileId = ref(0)
const isUploading = ref(false)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  // check local transactions
  localTxCount.value = await appService.db.transactions.count()

  // fetch remote backups
  backupsCount.value = await backup.getRemoteBackupCount()

  // Latest backup details
  let latest = await backup.getLatestFile()
  if (!latest) {
    latest = {
      name: '',
      fileid: 0
    }
  }
  lastBackupFilename.value = latest.name
  lastBackupFileId.value = latest.fileid

}

async function onBackupClick() {
  isUploading.value = true

  // get the content
  const output = await appService.getExportTransactions()

  await backup.backup(output)
  Notification.positive('Journal backed up to the cloud.')

  await loadData()

  isUploading.value = false
}

function onRestoreClick() {
  Notification.negative('restore not implemented yet')
}
</script>