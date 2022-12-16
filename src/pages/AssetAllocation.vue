<template>
  <q-page padding class="text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" @click="menuClicked">
          <icon-menu />
        </q-btn>

        <q-toolbar-title>Asset Allocation</q-toolbar-title>

        <q-btn flat round dense>
          <more-vertical />
          <q-menu>
            <q-list style="min-width: 175px">
              <q-item v-close-popup clickable @click="onSetupClick">
                <q-item-section>Setup</q-item-section>
                <q-item-section side>
                  <icon-settings />
                </q-item-section>
              </q-item>

              <q-item v-if="canShare" v-close-popup clickable @click="onShareClick">
                <q-item-section>Share</q-item-section>
                <q-item-section side>
                  <share2 />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onExportClick">
                <q-item-section>Export</q-item-section>
                <q-item-section side>
                  <file-down />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onValidateClick">
                <q-item-section>Validate</q-item-section>
                <q-item-section side>
                  <icon-scale />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onHelpClick">
                <q-item-section>Help</q-item-section>
                <q-item-section side>
                  <help-circle />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- The button is required for file export, to attach the event! -->
    <div ref="buttonContainer" hidden="hidden">
      <q-btn color="secondary" text-color="accent" label="Export" />
    </div>

    <div style="height: 100%; width: 100%; overflow: scroll">
      <table>
        <thead>
          <tr>
            <th>Asset Class</th>
            <th>Allocation</th>
            <th>Current</th>
            <th>Diff.</th>
            <th>Diff. %</th>
            <th>Alloc. Value</th>
            <th>Current Val.</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assetClass in assetClasses" :key="assetClass.fullname">
            <!-- Asset Class Name -->
            <td>
              <span :style="{ paddingLeft: assetClass.depth + 'rem' }" />
              <router-link :to="{
                name: 'assetclassdetail',
                params: { fullname: assetClass.fullname },
              }">
                {{ assetClass.name }}
              </router-link>
            </td>
            <td class="text-right">{{ assetClass.allocation }}</td>
            <td class="text-right">{{ assetClass.currentAllocation }}</td>
            <!-- difference -->
            <td class="text-right" style="width: 3rem">
              {{ assetClass.diff }}
            </td>
            <!-- difference % -->
            <td class="text-right" style="width: 3.5rem" :class="{
              'text-red-10': assetClass.diffPerc <= -20,
              'text-red-3':
                -20 < assetClass.diffPerc && assetClass.diffPerc < 0,
              'text-green-3':
                assetClass.diffPerc > 0 && assetClass.diffPerc < 20,
              'text-green-9': assetClass.diffPerc >= 20,
            }">
              {{ assetClass.diffPerc }}
            </td>
            <!-- Allocated Value -->
            <td class="text-right">{{ assetClass.allocatedValue }}</td>
            <!-- Current Value -->
            <td class="text-right" style="width: 5.5rem">
              {{ assetClass.currentValue }}
            </td>
            <td class="text-right" :class="{
              'text-red-10': assetClass.diff < -20,
              'text-red-3': assetClass.diff < 0,
              'text-green-3': assetClass.diff > 0,
              'text-green-9': assetClass.diff > 20,
            }">
              {{ assetClass.diffAmount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/mainStore'
import { computed, onMounted, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'
import { engine } from '../lib/AssetAllocation'
import moment from 'moment'
import { AssetClass } from 'src/lib/AssetClass'
import {
  FileDown, HelpCircle, Menu as IconMenu, MoreVertical, Settings as IconSettings,
  Scale as IconScale, Share2
} from 'lucide-vue-next'

const mainStore = useMainStore()
const $router = useRouter()
const $q = useQuasar()

// computed

const canShare = computed(() => {
  return navigator && 'share' in navigator
})

// data
const assetClasses: Ref<AssetClass[]> = ref([])
const buttonContainer: Ref<any> = ref(null)

onMounted(async () => {
  await loadData()
})

function downloadAsFile(content: string) {
  var a = document.createElement('a')

  // filename
  // todo: let now = moment()
  let now = new Date()
  let filename = 'asset_allocation-'
  filename += now.toISOString().substring(0, 10)
  filename += '_'
  filename += ('' + now.getHours()).padStart(2, '0')
  filename += '-'
  filename += ('' + now.getMinutes()).padStart(2, '0')
  // filename += now.getTimezoneOffset()
  filename += '.txt'
  a.download = filename

  let encoded = btoa(content)
  // a.href = "data:application/octet-stream;base64," + Base64.encode(this.output);
  a.href = 'data:text/plain;base64,' + encoded
  // charset=UTF-8;

  buttonContainer.value.appendChild(a)
  a.click()

  // cleanup?
  buttonContainer.value.removeChild(a)
}

function getAaForExport() {
  let output = engine.formatAllocationRowsForTxtExport(assetClasses.value)
  return output
}

async function loadData() {
  try {
    let result = await engine.loadFullAssetAllocation()
    assetClasses.value = result
  } catch (error: any) {
    console.error(error)
    $q.notify({ message: error.message, color: 'secondary' })
  }
}

function menuClicked() {
  mainStore.toggleDrawer()
}

function onExportClick() {
  let output = getAaForExport()
  downloadAsFile(output)
}

function onHelpClick() {
  // navigate to help page
  $router.push({ name: 'assetallocationhelp' })
}

function onSetupClick() {
  $router.push({ name: 'settings' })
}

function onShareClick() {
  // prepare for export?
  let output = getAaForExport()

  let dateFormatted = 'today'
  navigator.share({
    title: 'Asset Allocation ' + dateFormatted,
    text: output,
    url: 'https://cashier.alensiljak.eu.org/',
  })
}

/**
 * validate the allocation (definition)
 */
function onValidateClick() {
  if (assetClasses.value.length === 0) {
    $q.notify({ message: 'Please recalculate the allocation first.' })
  }

  // confirm that the group allocations match the sum of the children's allocation.
  let errors = engine.validate(engine.assetClassIndex)
  if (errors.length > 0) {
    let message = 'Errors: '
    for (let i = 0; i < errors.length; i++) {
      message += errors[i]
    }
    $q.notify({ message: message, color: 'secondary' })
  } else {
    $q.notify({
      message: 'The allocation is valid.',
      color: 'teal-9',
    }) // teal
  }
}
</script>

<style lang="scss" scoped>
@import '../css/palette.scss';

a {
  color: $colour2;
  //color: $amber-2;
}
</style>
