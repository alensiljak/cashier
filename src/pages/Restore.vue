<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Restore Backup" />

    <p>You can currently restore the backup of Scheduled Transactions</p>
    <p>
      Note that this will overwrite all your current records of the same type!
    </p>

    <q-file
      v-model="file"
      dark
      clearable
      label="Select backup file"
      @update:model-value="onFileSelected"
    />

    <q-input v-model="fileContent" dark type="textarea" />

    <div class="text-center q-pt-lg">
      <q-btn color="accent" text-color="secondary" @click="onRestoreClicked">
        Restore
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import appService from '../appService'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// data
const file = ref(null)
const fileContent = ref(null)

// methods

function onFileSelected(value) {
  // console.debug('file selected', file.value)
  // read file
  appService.readFile(file.value, onFileRead)
}

function onFileRead(content) {
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
<script>
import Toolbar from '../components/CashierToolbar.vue'

export default {
  components: {
    Toolbar,
  },
  props: {
    type: {
      type: String,
      default: 'scheduled',
    },
  },
}
</script>