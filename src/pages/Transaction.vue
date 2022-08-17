<template>
  <q-page padding class="bg-colour1 text-amber-2">
    <!-- toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title>Journal Transaction</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="check" @click="onSaveClicked" />
      </q-toolbar>
    </q-header>

    <div v-if="!tx || !tx.id" class="bg-primary text-center q-pa-sm q-ma-none">
      New transaction
    </div>

    <!-- Transaction -->
    <tx-editor />

    <q-separator dark />

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
      <!-- save -->
      <div class="col">
        <q-btn
          color="accent"
          text-color="secondary"
          size="medium"
          @click="onSaveClicked"
        >
          <font-awesome-icon
            icon="save"
            transform="grow-9"
            class="q-icon-small on-left"
          />
          Save
        </q-btn>
      </div>
    </footer>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="isConfirmDeleteVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary">
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

<script setup>
import { onMounted, provide, ref, toRaw } from 'vue'
import { useMainStore } from '../store/mainStore'
import { useRoute } from 'vue-router'
import { SettingKeys, settings } from 'src/lib/Configuration'
import { useQuasar } from 'quasar'
import appService from '../appService'

const router = useRoute()
const mainStore = useMainStore()
const { tx } = mainStore
const $q = useQuasar()

const isConfirmDeleteVisible = ref(false)

provide('tx', tx)

onMounted(async () => {
  //
})

function confirmDelete() {
  // Resets all Transaction fields to defaults.
  resetTransaction()
}

function onClear() {
  isConfirmDeleteVisible.value = true
}

async function onSaveClicked() {
  try {
    console.debug('saving tx', tx)

    let txObj = toRaw(tx)

    await appService.saveTransaction(txObj)

    // Remember Last Transaction?
    const remember = await settings.get(SettingKeys.rememberLastTransaction)
    if (remember) {
      await appService.saveLastTransaction(txObj)
    }

    await router.back()
  } catch (err) {
    console.error(err)
    $q.notify({ message: 'error: ' + err.message, color: 'negative' })
  }
}

function resetTransaction() {
  mainStore.newTx()
}
</script>
<script>
import TxEditor from '../components/TransactionEditor.vue'
import eventBus from '../lib/eventBus'

export default {
  components: {
    TxEditor,
  },

  // data() {
  //   return {}
  // },

  methods: {
    toggleDrawer() {
      eventBus.$emit('toggle-drawer')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/styles.scss';
</style>
