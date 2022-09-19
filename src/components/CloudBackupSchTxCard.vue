<template>
  <q-card bordered>
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="star" class="q-mr-sm" />
      <strong>Scheduled Transactions</strong>
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
        v-if="localTxCount > 0"
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

const lastBackupTimestamp = ref('n/a')
const backupsCount = ref(0)
const localTxCount = ref(0)

async function onBackupClick() {}

function onRestoreClick() {}
</script>