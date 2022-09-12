<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <Toolbar :title="'Cloud Backup'" />

    <!-- Cards -->

    <FavCard class="q-my-sm" />
    <JournalCard class="q-my-sm" />
    <SchTxCard class="q-my-sm" />
    <SettingsCard class="q-my-sm" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Toolbar from '../components/CashierToolbar.vue'
import useNotifications from '../lib/CashierNotification'
import useCloudBackup from '../lib/CloudBackup'
import JournalCard from '../components/CloudBackupJournalCard.vue'
import SettingsCard from 'src/components/CloudBackupSettingsCard.vue'
import SchTxCard from 'src/components/CloudBackupSchTxCard.vue'
import FavCard from 'src/components/CloudBackupFavouritesCard.vue'

const Notification = useNotifications()
</script>