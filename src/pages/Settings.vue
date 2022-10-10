<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'Settings'">
      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list style="min-width: 175px">
            <!-- <q-item v-close-popup clickable @click="onSchTxMigrationClick">
              <q-item-section>SchTx data migration</q-item-section>
              <q-item-section side>
                <q-icon name="drive_file_move_outline" />
              </q-item-section>
            </q-item> -->

            <q-item v-close-popup clickable @click="onDemoDataClick">
              <q-item-section>Create demo data</q-item-section>
              <q-item-section side>
                <q-icon name="data_object" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </toolbar>

    <div class="row">
      <div class="col">
        <!-- currency -->
        <q-input v-model="currency" dark label="Main Currency" />
      </div>
    </div>
    <p class="q-my-md">Investments</p>
    <div class="row">
      <div class="col">
        <!-- root investment account -->
        <q-input
          v-model="rootInvestmentAccount"
          label="Root investment account"
        />
      </div>
    </div>

    <div class="row q-mt-sm">
      <div class="col">
        <q-file
          v-model="aasettingsfile"
          label="Asset Allocation settings file"
          clearable
          @update:model-value="onAaFileSelected"
        />
      </div>
      <div class="col-1 text-center">
        <q-btn flat round dense @click="onAaHelpClick">
          <font-awesome-icon icon="question-circle" />
        </q-btn>
      </div>
      <div class="col text-right">
        <q-btn
          label="Import"
          color="secondary"
          text-color="accent"
          @click="onDefinitionImportClick"
        />
      </div>
      <!-- </div> -->
    </div>

    <p class="q-my-md">Last Transaction</p>
    <div class="row">
      <div class="col">
        <q-checkbox
          v-model="rememberLastTransaction"
          label="Remember last transaction for payees. Fills the new transactions."
        />
      </div>
    </div>

    <div class="row">Dark Mode</div>
    <div class="row">
      <div class="col">
        <q-checkbox
          v-model="$q.dark.isActive"
          label="Use dark mode."
          @update:model-value="toggleDarkMode"
        />
      </div>
    </div>

    <!-- <div class="row">
      <div class="col">
        <q-input v-model="backupLocation" label="Backup Location"  />
      </div>
      <div class="col">
        <q-btn label="Select" @click="onSelectBackupLocationClick" />
      </div>
    </div> -->

    <div class="row q-mt-lg">
      <div class="col text-center q-my-lg">
        <q-btn
          label="save"
          color="secondary"
          text-color="accent"
          @click="onSaveClick"
        />
      </div>
    </div>

    <hr />

    <div class="row q-mt-md">
      <div class="col">
        <div>Restore</div>
        <p>You can restore settings from a backup file.</p>
      </div>
      <div class="col text-center">
        <q-file
          accept=".json"
          v-model="restoreFile"
          label="settings backup file"
          clearable
          @update:model-value="onRestoreFileSelected"
        />
      </div>
      <div class="col text-right" v-if="restoreFile">
        <q-btn
          label="Restore"
          color="secondary"
          text-color="accent"
          @click="onRestoreClick"
        />
      </div>
    </div>

    <q-dialog
      v-model="isRestoreConfirmationVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary">
        <q-card-section class="q-pa-sm">
          <div class="row">
            <div class="col-1 q-mt-none">
              <q-icon name="help" />
            </div>
            <div class="col text-center q-mt-xs">Confirm restore</div>
          </div>
        </q-card-section>
        <q-card-section class="row items-center">
          <span>
            Do you want to restore the backup <br />
            {{ restoreFile.name }}?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Restore"
            color="accent"
            @click="onConfirmRestore"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row q-mt-lg">
      <div class="col q-my-lg">
        <p>
          Force-reload the page to refresh the version in case the background
          worker does not manage to update to the latest version.
        </p>
      </div>
      <div class="col text-right">
        <q-btn
          label="Reload App"
          color="secondary"
          text-color="accent"
          @click="reloadApp"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import appService from '../appService'
import useNotifications from 'src/lib/CashierNotification'
import db from '../store/indexedDb'
import { SettingKeys, settings } from '../lib/Configuration'
import Toolbar from '../components/CashierToolbar.vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const Notification = useNotifications()
const $router = useRouter()
const $q = useQuasar()

const currency = ref('')
const rememberLastTransaction = ref(null)
const rootInvestmentAccount: Ref<string> = ref('')
const restoreFile = ref(null)
const isRestoreConfirmationVisible = ref(false)

onMounted(async () => {
  //
  await loadSettings()
})

async function loadSettings() {
  currency.value = await settings.get(SettingKeys.currency)
  rootInvestmentAccount.value = await settings.get(
    SettingKeys.rootInvestmentAccount
  )
  rememberLastTransaction.value = await settings.get(
    SettingKeys.rememberLastTransaction
  )
}

async function onRestoreClick() {
  // todo: confirm settings overwrite
  isRestoreConfirmationVisible.value = true
}

/**
 * happens after the user confirms restoring the selected settings file.
 */
async function onConfirmRestore() {
  // restore
  const contents: any = await appService.readFileAsync(restoreFile.value)
  //console.log('file:', contents)

  // clear settings table
  await db.settings.clear()

  // store the new settings from json
  const records = JSON.parse(contents)
  await db.settings.bulkAdd(records)

  Notification.positive('Settings imported')

  await loadSettings()
}

function onRestoreFileSelected(file: any) {
  //
  //console.log('restore file selected', file, 'type:', typeof file)
  restoreFile.value = file
}

function onAaHelpClick() {
  // navigate to help page
  $router.push({ name: 'assetallocationsetuphelp' })
}

function onDemoDataClick() {
  $router.push({ name: 'demoData' })
}

function darkMode() {
  //isDarkModeOn.value = $q.dark.isActive
  //console.debug($q.dark.mode)
  //$q.dark.set(true)
  // $q.dark.toggle()
}

/**
 * Migrate Transaction records inside the ScheduledTransaction to objects from JSON.
 */
async function onSchTxMigrationClick() {
  let result = ''
  let counter = 0

  try {
    let schTxs = await appService.db.scheduled.toArray()

    // convert JSON Transaction records to objects.
    schTxs.forEach((schTx) => {
      if (typeof schTx.transaction == 'string') {
        let tx = JSON.parse(schTx.transaction)
        schTx.transaction = tx

        counter++
      }
    })

    //schTxs
    result = await appService.db.scheduled.bulkPut(schTxs)
  } catch (error: any) {
    Notification.negative(error)
  }

  Notification.info(
    counter +
      ' SchTx Transaction records converted from JSON to objects.' +
      result
  )
}

function reloadApp() {
  // force reload
  window.location.reload(true)
}

async function onSaveClick() {
  // currency
  await settings.set(SettingKeys.currency, currency.value)

  // root investment account
  await settings.set(
    SettingKeys.rootInvestmentAccount,
    rootInvestmentAccount.value
  )

  await settings.set(
    SettingKeys.rememberLastTransaction,
    rememberLastTransaction.value
  )

  $q.notify({ message: 'Settings saved', color: 'positive' })
}

function toggleDarkMode() {
  //console.debug('toggling')
  //$q.dark.toggle()
}
</script>

<script lang="ts">
import { engine } from '../lib/AssetAllocation'

export default {
  data: function () {
    return {
      aasettingsfile: null,
      backupLocation: null,
      fileContent: null,
    }
  },

  methods: {
    /**
     * The Asset Allocation definition selected.
     */
    onAaFileSelected(files) {
      if (!files) return
      appService.readFile(files, this.onFileRead)
    },
    async onDefinitionImportClick() {
      try {
        // Clean-up any existing data first.
        await engine.emptyData()
        // import AA definition file
        //await engine.importDefinition(this.fileContent)
        await engine.importYamlDefinition(this.fileContent)

        this.$q.notify({ message: 'Definition imported', color: 'positive' })
      } catch (error) {
        console.error(error)
        this.$q.notify({
          message: 'Error during import: ' + error,
          color: 'secondary',
          textColor: 'amber-2',
        })
      }
    },
    onFileRead(content) {
      this.fileContent = content
    },
    async onSelectBackupLocationClick() {
      let dirHandle = await window.showDirectoryPicker()

      // assuming we have a directory handle: 'currentDirHandle'
      const subDir = dirHandle.getDirectoryHandle(dirName, {
        create: true,
      })
    },
  },
}
</script>
