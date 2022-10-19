<template>
  <q-page padding class="text-colour2">
    <toolbar title="Restore Backup" />

    <p>You can currently restore the backup of Scheduled Transactions</p>
    <p>
      Note that this will overwrite all your current records of the same type!
    </p>

    <q-file v-model="file" clearable label="Select backup file" @update:model-value="onFileSelected" />

    <q-input v-model="fileContent" type="textarea" />

    <div class="text-center q-pt-lg">
      <q-btn color="accent" text-color="secondary" @click="onRestoreClicked">
        Restore
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import appService from '../appService'
import { useQuasar } from 'quasar'
import Toolbar from '../components/CashierToolbar.vue'

const $q = useQuasar()

const props = defineProps({
  type: { type: String, default: 'scheduled' }
})

// data
const file: Ref<Blob> | Ref<null> = ref(null) // The selected file.
const fileContent: Ref<string> = ref('')      // Selected file's contents.

// methods

function onFileSelected(value: File) {
  // read file
  //appService.readFile(file.value as Blob, onFileRead)
  appService.readFile(value, onFileRead)
}

function onFileRead(content: string) {
  fileContent.value = content
}

async function onRestoreClicked() {
  // restore data from the file
  if (!fileContent.value) {
    $q.notify({
      message: 'You need to select a file',
      color: 'negative',
    })
    return
  }

  //console.log(this.fileContent)
  await appService.importScheduledTransactions(fileContent.value)
  $q.notify({
    message: 'Restore complete',
    color: 'positive',
  })
}
</script>
