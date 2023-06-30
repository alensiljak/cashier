<template>
  <q-page padding class="text-colour2">
    <toolbar :title="'Settings'">
      <q-btn flat round dense>
        <more-vertical />
        <q-menu>
          <q-list style="min-width: 175px">
            <q-item v-close-popup clickable @click="onDemoDataClick">
              <q-item-section>Create demo data</q-item-section>
              <q-item-section side>
                <curly-braces />
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="onOpfsClick">
              <q-item-section>OPFS Experiment</q-item-section>
              <q-item-section side>
                <FolderOpen />
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
        <q-input v-model="rootInvestmentAccount" label="Root investment account" />
      </div>
    </div>

    <p class="q-my-md">Last Transaction</p>
    <div class="row">
      <div class="col">
        <q-checkbox v-model="rememberLastTransaction"
          label="Remember last transaction for payees. Fills the new transactions." />
      </div>
    </div>

    <div class="row">Dark Mode</div>
    <div class="row">
      <div class="col">
        <q-checkbox v-model="$q.dark.isActive" label="Use dark mode." @update:model-value="toggleDarkMode" />
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
        <q-btn label="save" color="secondary" text-color="accent" @click="onSaveClick" />
      </div>
    </div>

    <hr />

    <!-- Asset Allocation -->
    <h5 class="q-mt-md q-mb-none">Asset Allocation</h5>
    <div class="row">
      <div class="col">
        <q-file v-model="aaSettingsFile" label="Asset Allocation settings file" clearable
          @update:model-value="onAaFileSelected" />
      </div>
      <div class="col-1 text-center">
        <q-btn flat round dense @click="onAaHelpClick">
          <help-circle />
        </q-btn>
      </div>
      <div v-if="aaSettingsFile" class="col-3 text-center">
        <q-btn label="Import" color="secondary" text-color="accent" @click="onDefinitionImportClick" />
      </div>
    </div>

    <!-- Restore -->
    <h5 class="q-mt-md q-mb-none">Restore Settings</h5>
    <div class="row">
      <div class="col text-center">
        <q-file accept=".json" v-model="restoreFile" label="settings backup file" clearable
          @update:model-value="onRestoreFileSelected" />
      </div>
      <div class="col text-right" v-if="restoreFile">
        <q-btn label="Restore" color="secondary" text-color="accent" @click="onRestoreClick" />
      </div>
    </div>

    <q-dialog v-model="isRestoreConfirmationVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-secondary">
        <q-card-section class="q-pa-sm">
          <div class="row">
            <div class="col-1 q-mt-none">
              <help-circle />
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
          <q-btn v-close-popup flat label="Restore" color="accent" @click="onConfirmRestore" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <h5 class="q-mt-md q-mb-none">Reload App</h5>
    <div class="row q-mb-lg">
      <div class="col">
        Force-reload the page to refresh the version in case the background service
        worker does not manage to update to the latest version.
      </div>
      <div class="col-3 text-center">
        <q-btn label="Reload App" color="secondary" text-color="accent" @click="reloadApp" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import db from '../store/indexedDb'
import Toolbar from '../components/CashierToolbar.vue'
import { SettingKeys, settings } from '../lib/settings'
import useNotifications from 'src/lib/CashierNotification'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { engine } from '../lib/AssetAllocation'
import appService from '../appService'
import { CurlyBraces, FolderOpen, HelpCircle, MoreVertical } from 'lucide-vue-next'

const Notification = useNotifications()
const $router = useRouter()
const $q = useQuasar()

// data

const currency = ref('')
const rememberLastTransaction: Ref<boolean | undefined> = ref(undefined)
const rootInvestmentAccount: Ref<string> = ref('')
const restoreFile: Ref<Blob> | Ref<null> = ref(null)
const isRestoreConfirmationVisible = ref(false)
const fileContent: Ref<string> = ref('')
const aaSettingsFile = ref(null)

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

/**
 * The Asset Allocation definition selected.
 */
async function onAaFileSelected(file: Blob) {
  if (!file) return

  const content = await appService.readFileAsync(file)
  fileContent.value = content
}

function onOpfsClick() {
  $router.push('/opfs')
}

async function onRestoreClick() {
  // confirm settings overwrite
  isRestoreConfirmationVisible.value = true
}

/**
 * happens after the user confirms restoring the selected settings file.
 */
async function onConfirmRestore() {
  // restore
  const contents: any = await appService.readFileAsync(restoreFile.value as Blob)

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

async function onDefinitionImportClick() {
  try {
    // Clean-up any existing data first.
    await engine.emptyData()
    // import AA definition file
    //await engine.importDefinition(this.fileContent)
    //await engine.importYamlDefinition(fileContent.value)
    await engine.importTomlDefinition(fileContent.value)

    $q.notify({ message: 'Definition imported', color: 'positive' })
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Error during import: ' + error,
      color: 'secondary',
      textColor: 'amber-2',
    })
  }
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
  let result = null
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

let backupLocation = ref(null);

async function onSelectBackupLocationClick() {
  let dirHandle = await window.showDirectoryPicker();
  // assuming we have a directory handle: 'currentDirHandle'
  const subDir = dirHandle.getDirectoryHandle(dirName, {
    create: true,
  });
}

function reloadApp() {
  // force reload
  window.location.reload(true)
}

async function onSaveClick() {
  // currency
  await settings.set(SettingKeys.currency, currency.value)

  // root investment account
  await settings.set(SettingKeys.rootInvestmentAccount, rootInvestmentAccount.value)

  await settings.set(SettingKeys.rememberLastTransaction, rememberLastTransaction.value)

  $q.notify({ message: 'Settings saved', color: 'positive' })
}

function toggleDarkMode() {
  //console.debug('toggling')
  //$q.dark.toggle()
}
</script>
