<template>
  <q-page padding class="text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="menuClicked"
        />

        <q-toolbar-title>Accounts</q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 175px">
              <!-- dense -->
              <q-item v-close-popup clickable :to="{ name: 'sync' }">
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="sync-alt"
                    transform="grow-9 left-5"
                  />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable>
                <q-item-section @click="onDeleteAllClick">
                  Delete All
                </q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="trash-alt"
                    transform="grow-9 left-5"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <!-- search -->
      <q-toolbar class="text-white flex flex-center">
        <!-- <q-toolbar-title> -->
        <q-input
          v-model="filter"
          autofocus
          rounded
          standout
          dense
          color="accent"
          style="width: 23rem"
          debounce="400"
        >
          <template #append>
            <font-awesome-icon v-if="filter === ''" icon="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="filter = ''"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="accounts"
      :item-size="42"
      key-field="name"
    >
      <div class="scroller-item" @click="itemClicked(item.name)">
        <div class="scroller-item-content">
          {{ item.name }}
        </div>
        <div class="scroller-item-action">
          {{ item.balance }} {{ item.currency }}
        </div>
      </div>
    </RecycleScroller>

    <!-- new account (name) dialog -->
    <q-dialog v-model="dialogVisible">
      <!-- persistent -->
      <q-card style="min-width: 400px" class="bg-primary text-colour2">
        <q-card-section>
          <div class="text-h6">New Account</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newAccount"
            dense
            autofocus
            input-class="text-amber-2"
            color="accent"
            @keyup.enter="onAddAccount"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-accent">
          <q-btn v-close-popup flat label="Cancel" @click="onCancelAdd" />
          <q-btn v-close-popup flat label="Add" @click="onAddAccount" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFab">
        <q-icon name="add" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="confirmDeleteAllVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card class="bg-secondary">
        <q-card-section class="row items-center">
          <span>Do you want to delete all accounts?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn
            v-close-popup
            flat
            label="Delete"
            color="accent"
            @click="confirmDeleteAll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '../store/mainStore'
import appService from '../appService'

const mainStore = useMainStore()

// data

const accounts = ref([])
const filterText = ref(null)
const dialogVisible = ref(false)
const newAccount = ref(null)
const confirmDeleteAllVisible = ref(false)

// computed

const filter = computed({
  get() {
    return filterText.value
  },
  set(value) {
    filterText.value = value
    loadData()
  },
})

onMounted(async () => {
  await loadData()
})

// methods

async function confirmDeleteAll() {
  await appService.deleteAccounts()
  await loadData()
}

async function loadData() {
  let records = appService.db.accounts.orderBy('name')

  if (filter.value) {
    let search = new ListSearch()
    let regex = search.getRegex(filter.value)

    records = records.filter((account) => regex.test(account.name))
  }
  let accounts_array = await records.toArray()

  accounts.value = accounts_array
}

function menuClicked() {
  mainStore.toggleDrawer()
}

async function onAddAccount() {
  // create new account
  if (!newAccount.value) return
  dialogVisible.value = false

  await appService.createAccount(newAccount.value)
  // reset the new account name.
  newAccount.value = null

  await loadData()
}

function onCancelAdd() {
  dialogVisible.value = false
  newAccount.value = null
}

function onDeleteAllClick() {
  confirmDeleteAllVisible.value = true
}

function onFab() {
  // New Account
  dialogVisible.value = true
}

async function onDeleteAccount(accountName) {
  // console.log(event);
  await appService.deleteAccount(accountName)
  await loadData()
}
</script>
<script>
import { ListSearch } from '../ListSearch.js'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  components: {
    RecycleScroller,
  },

  data() {
    return {
      pickerMode: false,
    }
  },

  created() {
    // picker mode
    let meta = this.$store.state.selectModeMeta
    this.pickerMode = !!meta
  },

  methods: {
    itemClicked(id) {
      if (this.pickerMode) {
        // select the item and return to the caller.
        this.$store.dispatch('setSelectedId', id)

        this.$router.go(-1)
      } else {
        // edit account
        this.$router.push({ name: 'account', params: { id: id } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/palette.scss';

.bg {
  background-color: $colour1;
}

.scroller {
  height: 100%;
}

.scroller-item {
  height: 32%;
  padding: 0 12px;
  display: flex;
  // justify-content: space-evenly;
  align-items: center;
}

.scroller-item-content {
  flex-grow: 1;
}
.scroller-item-action {
  text-align: right;
}
</style>
