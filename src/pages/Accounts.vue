<template>
  <q-page padding class="bg-colour1 text-colour2">
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
            <q-list dark style="min-width: 175px" class="bg-colour1">
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
          dark
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

    <!-- <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="accounts"
      :item-size="42"
      key-field="name"
    >
      <div class="scroller-item" @click="itemClicked(item.name)">
        {{ item.name }}
        <div class="fixed-right">{{ item.balance }} {{ item.currency }}</div>
      </div>
    </RecycleScroller> -->

    <q-list>
      <q-item
          v-for="account in accounts"
          :key="account.name"
      >
        <q-item-section no-wrap=false>
          {{ account.name }}
        </q-item-section>
        <q-item-section side>
          {{ account.balance }} {{ account.currency }}
        </q-item-section>
      </q-item>
    </q-list>

    <!-- new account (name) dialog -->
    <q-dialog v-model="dialogVisible" dark>
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
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="confirmDeleteAllVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary">
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

<script>
import { TOGGLE_DRAWER, SET_SELECT_MODE } from '../mutations'
import appService from '../appService.js'
import { ListSearch } from '../ListSearch.js'
import Vue from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.component('RecycleScroller', RecycleScroller)

export default {

  data() {
    return {
      confirmDeleteAllVisible: false,
      dialogVisible: false,
      newAccount: null,
      accounts: [],
      filterText: null, // filter for the account name
      pickerMode: false,
    }
  },

  computed: {
    filter: {
      get() {
        return this.filterText
      },
      set(value) {
        this.filterText = value
        this.loadData()
      },
    },
  },

  created() {
    this.loadData()

    // picker mode
    this.pickerMode = !!this.$store.state.selectModeMeta
  },

  methods: {
    async confirmDeleteAll() {
      await appService.deleteAccounts()
      await this.loadData()
    },
    itemClicked(id) {
      if (this.pickerMode) {
        // select the item and return to the caller.
        let meta = this.$store.state.selectModeMeta

        meta.selectedId = id
        this.$store.commit(SET_SELECT_MODE, meta)

        this.$router.go(-1)
      } else {
        // edit account
        this.$router.push({ name: 'account', params: { id: id } })
      }
    },
    async loadData() {
      let accounts = appService.db.accounts.orderBy('name')

      if (this.filter) {
        let search = new ListSearch()
        let regex = search.getRegex(this.filter)

        accounts = accounts.filter((account) => regex.test(account.name))
      }
      let accounts_array = await accounts.toArray()
      this.accounts = accounts_array
    },
    menuClicked() {
      let visible = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
    async onAddAccount() {
      // create new account
      if (!this.newAccount) return
      this.dialogVisible = false

      await appService.createAccount(this.newAccount)
      // reset the new account name.
      this.newAccount = null

      await this.loadData()
    },
    onCancelAdd() {
      this.dialogVisible = false
      this.newAccount = null
    },
    async onDeleteAccount(accountName) {
      // console.log(event);
      await appService.deleteAccount(accountName)
      this.loadData()
    },
    onDeleteAllClick() {
      this.confirmDeleteAllVisible = true
    },
    onFab() {
      // New Account
      this.dialogVisible = true
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
  align-items: center;
}
</style>
