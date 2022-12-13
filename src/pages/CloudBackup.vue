<template>
  <q-page padding class="text-amber-2">
    <Toolbar :title="'Cloud Backup'">
      <q-btn flat round dense>
        <more-vertical />
        <q-menu>
          <q-list style="min-width: 175px">
            <q-item v-close-popup clickable @click="promptResetCloudSettings">
              <q-item-section>Reset cloud settings</q-item-section>
              <q-item-section side>
                <!-- <curly-braces /> -->
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

    </Toolbar>

    <!-- Cards -->

    <JournalCard class="q-my-sm" />
    <SchTxCard class="q-my-sm" />
    <SettingsCard class="q-my-sm" />

    <!-- Dialogs -->

    <!-- Reset cloud settings confirmation dialog -->
    <q-dialog v-model="isVisibleResetCloudSettingsConfirmation" persistent content-class="bg-blue-grey-10">
      <q-card class="bg-negative text-amber-2">
        <q-card-section class="row items-center">
          <span>Do you want to reset the cloud settings to their default?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="No" color="accent" />
          <q-btn v-close-popup flat label="Yes" color="accent" @click="resetCloudSettings" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Toolbar from '../components/CashierToolbar.vue'
import useNotifications from '../lib/CashierNotification'
import useCloudBackup from '../lib/CloudBackup'
import JournalCard from '../components/CloudBackupJournalCard.vue'
import SettingsCard from 'src/components/CloudBackupSettingsCard.vue'
import SchTxCard from 'src/components/CloudBackupSchTxCard.vue'
import { MoreVertical } from 'lucide-vue-next'

const Notification = useNotifications()
const isVisibleResetCloudSettingsConfirmation = ref(false)

function promptResetCloudSettings() {
  // show a confirmation dialog
  isVisibleResetCloudSettingsConfirmation.value = true
}

async function resetCloudSettings() {
  const { settingsBackup: backup } = useCloudBackup()

  await backup.resetSettings()

  //Notification.info("The cloud settings have been reset. Please refresh the page")
  window.location.reload()

}
</script>