<template>
  <q-card dark bordered @click="onCardClick">
    <q-card-section class="bg-primary q-pa-sm">
      <font-awesome-icon icon="star" class="q-mr-sm" />
      <strong>Journal</strong>
    </q-card-section>

    <q-card-section>
      <div v-if="accounts.length === 0">There are no local transactions.</div>

      <q-list>
        <q-item
          v-for="account in accounts"
          :key="account.name"
          class="q-px-none"
          dense
        >
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>
            {{ account.balance }} {{ account.currency }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useCloudBackup from 'src/lib/CloudBackup'

const { favourites: backup } = useCloudBackup()

// data
const accounts = ref([])

onMounted(async () => {
  // fetch remote backups
  console.debug(backup)
  //   backup.yo()
  //backup.cloud.favourites.
})
</script>