<template>
  <q-page padding class="text-amber-2">
    <!-- toolbar -->
    <cashier-toolbar title="Journal Transaction">
      <q-btn flat round dense icon="check" @click="onSaveClicked" />
    </cashier-toolbar>

    <div v-if="!tx || !tx.id" class="bg-primary text-center q-pa-sm q-ma-none">
      New transaction
    </div>

    <!-- Transaction -->
    <tx-editor />

    <q-separator />

    <!-- main (tx) Actions -->

    <footer class="row q-my-xl justify-end text-center">
      <!-- Reset -->
      <div class="col">
        <q-btn
          color="secondary"
          text-color="accent"
          size="medium"
          @click="onClear"
        >
          <font-awesome-icon
            icon="times-circle"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Reset
        </q-btn>
      </div>
    </footer>

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFab">
        <q-icon name="done" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="isConfirmDeleteVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card class="bg-secondary">
        <q-card-section class="row items-center">
          <span>Do you want to clear all the fields?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Confirm"
            color="accent"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, toRaw, toRefs } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useRouter } from 'vue-router'
import { SettingKeys, settings } from 'src/lib/Configuration'
import { useQuasar } from 'quasar'
import appService from '../appService'
import TxEditor from '../components/TransactionEditor.vue'
import { storeToRefs } from 'pinia'
import CashierDAL from '../store/dal'
import { Transaction } from 'src/model'
import CashierToolbar from 'src/components/CashierToolbar.vue'

const router = useRouter()
const mainStore = useMainStore()
const { tx } = storeToRefs(mainStore)
const $q = useQuasar()
const dal = new CashierDAL()

// props

// const props = defineProps({ id: { type: String, default: null } })
// const { id } = toRefs(props)

// data

const isConfirmDeleteVisible = ref(false)

provide('tx', tx)

onMounted(async () => {
  // const numId = Number(id.value)
  // if (!tx.value || tx.value.id !== numId) {
  //   await mainStore.loadTx(id.value)
  // }
})

function confirmDelete() {
  // Resets all Transaction fields to defaults.
  resetTransaction()
}

function onClear() {
  isConfirmDeleteVisible.value = true
}

async function onFab() {
  // save
  await onSaveClicked()
}

async function onSaveClicked() {
  try {
    let txObj = toRaw(tx.value) as Transaction

    await dal.saveTransaction(txObj)

    // Remember Last Transaction?
    const remember = await settings.get(SettingKeys.rememberLastTransaction)
    if (remember) {
      await appService.saveLastTransaction(txObj)
    }

    await router.back()
  } catch (error: any) {
    console.error(error)
    $q.notify({ message: 'error: ' + error.message, color: 'negative' })
  }
}

function resetTransaction() {
  mainStore.newTx()
}

function toggleDrawer() {
  mainStore.toggleDrawer()
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
</style>
