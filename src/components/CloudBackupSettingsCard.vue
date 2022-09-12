<template>
  <q-card dark bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="star" class="q-mr-sm" />
      <strong>Settings</strong>
    </q-card-section>

    <q-card-section>
      <div>
        Last backup: {{ lastBackupTimestamp }}. Total backups:
        {{ backupsCount }}
      </div>
    </q-card-section>

    <q-card-section class="text-center">
      <q-btn
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

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'
import useNotifications from 'src/lib/CashierNotification'
import appService from '../appService'
import { settings, SettingKeys } from '../lib/Configuration'

const { settingsBackup: backup } = useCloudBackup()
const Notification = useNotifications()

const lastBackupTimestamp = ref('n/a')
const backupsCount = ref(0)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  backupsCount.value = await backup.getRemoteBackupCount()
}

async function onBackupClick() {
  // get all settings
  const allSettings = await settings.getAll()
  const settingsJson = JSON.stringify(allSettings)

  await backup.backup(settingsJson)

  Notification.positive('Settings backed up to the cloud.')
}

function onRestoreClick() {
  Notification.negative('Not implemented yet')
}
</script>