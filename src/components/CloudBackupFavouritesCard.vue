<template>
  <q-card bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="star" class="q-mr-sm" />
      <strong>Favourite Accounts</strong>
    </q-card-section>

    <q-card-section>
      <div>
        Total backups: {{ backupsCount }} <br />
        Last backup: {{ lastBackupTimestamp }}.
      </div>
    </q-card-section>

    <q-card-section class="text-center">
      <q-btn
        color="primary"
        text-color="accent"
        @click="onBackupClick"
        class="q-mr-lg"
        v-if="localRecordsCount > 0"
      >
        Backup
      </q-btn>
      <q-btn
        color="accent"
        text-color="secondary"
        @click="onRestoreClick"
        v-if="backupsCount > 0"
      >
        Restore
      </q-btn>
    </q-card-section>
  </q-card>
</template>
  
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'

const { favourites: backup } = useCloudBackup()

const lastBackupTimestamp = ref('n/a')
const backupsCount = ref(0)
const localRecordsCount = ref(0)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  backupsCount.value = await backup.getRemoteBackupCount()

  //let latest = await backup.getLatestFilename()
  let latest = await backup.getLatestFile()
  lastBackupFilename.value = latest.name
  lastBackupFileId.value = latest.fileid
}

async function onBackupClick() {}

function onRestoreClick() {}
</script>