<template>
  <q-card bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <cog size="20" class="icon q-mr-sm" />
      <strong>Settings</strong>
    </q-card-section>

    <q-card-section>
      <div>
        Total backups: {{ backupsCount }} <br />
        Last backup: {{ lastBackupFilename }}.
      </div>
    </q-card-section>

    <!-- buttons -->
    <q-card-section class="text-center">
      <q-btn color="primary" text-color="accent" @click="onBackupClick" class="q-mr-lg">
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

    <!-- confirm deletion dialog -->
    <q-dialog v-model="isRestoreConfirmationVisible" persistent content-class="bg-blue-grey-10">
      <q-card class="bg-secondary">
        <q-card-section class="row items-center">
          <span>
            Do you want to restore the backup {{ lastBackupFilename }}?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn v-close-popup flat label="Restore" color="accent" @click="onConfirmRestore" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'
import useNotifications from 'src/lib/CashierNotification'
import { settings, SettingKeys } from '../lib/settings'
import { Cog, Star } from 'lucide-vue-next'

const { settingsBackup: backup } = useCloudBackup()
const Notification = useNotifications()

const lastBackupFilename = ref('n/a')
const lastBackupFileId: Ref<any> = ref(null)
const backupsCount = ref(0)
const isRestoreConfirmationVisible = ref(false)

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

async function onBackupClick() {
  // get all settings
  const allSettings = await settings.getAll()
  const settingsJson = JSON.stringify(allSettings)

  await backup.backup(settingsJson)

  Notification.positive('Settings backed up to the cloud.')

  await loadData()
}

/**
 * Happens after the user confirms the deletion in a dialog.
 */
async function onConfirmRestore() {
  // load the last backup
  try {
    let file = await backup.download(lastBackupFileId.value)
    console.log('file:', file)
  } catch (error: any) {
    console.error(error)
    Notification.negative('Error downloading file:' + error.error)
  }

  // todo: clear the settings table
  // convert json to objects
  // todo: insert the records

  Notification.negative('Incomplete')
}

function onRestoreClick() {
  // prompt for confirmation
  isRestoreConfirmationVisible.value = true
}
</script>