<template>
  <q-page padding class="text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round aria-label="Menu" icon="menu" @click="onMenuClicked" />

        <q-toolbar-title>Favourites</q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 175px">
              <!-- dense -->
              <q-item v-close-popup clickable @click="addAccountClick">
                <q-item-section>Add</q-item-section>
                <q-item-section side>
                  <plus-circle />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onDeleteAllClick">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <trash2 />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onSortClick">
                <q-item-section>Reorder</q-item-section>
                <q-item-section side>
                  <arrow-up-down />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- account list -->
    <q-slide-item v-for="(account, index) in accounts" :key="account.name" right-color="secondary"
      @right="onRightSlide">
      <template #right>
        <div class="row items-center text-accent" @click="removeAccount(index)">
          Click to confirm or wait 2s to cancel
          <trash2 size="32" class="on-right" />
        </div>
      </template>

      <q-list separator class="text-colour2" dense>
        <q-item v-ripple clickable class="q-px-none" @click="onListItemClick(account.name)">
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>
            {{ account.balance.amount }} {{ account.balance.currency }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-slide-item>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <icon-plus />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog v-model="confirmDeleteDialogVisible" persistent content-class="bg-blue-grey-10">
      <q-card class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to unmark all the favourite accounts?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" color="accent" />
          <q-btn v-close-popup flat label="Delete" color="accent" @click="confirmDeleteAll" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useMainStore } from '../store/mainStore'
import { TransactionAugmenter } from 'src/lib/transactionAugmenter'
import appService from '../appService'
import { SET_SELECT_MODE } from '../mutations'
import {
  SelectionModeMetadata,
  settings,
  SettingKeys,
} from '../lib/settings'
import { ArrowUpDown, Plus as IconPlus, PlusCircle, Trash2 } from 'lucide-vue-next'

const mainStore = useMainStore()

function onMenuClicked() {
  mainStore.toggleDrawer()
}
</script>
<script lang="ts">
const ACCOUNT = 'account'

export default {
  data() {
    return {
      accounts: [],
      confirmDeleteDialogVisible: false,
      resetSlide: null,
    }
  },

  created() {
    let meta = this.$store.state.selectModeMeta
    if (meta) this.handleSelection()

    // load favourite accounts
    this.loadData()
  },

  methods: {
    addAccountClick() {
      // show the account picker
      let selectMode = new SelectionModeMetadata()

      // set the type
      selectMode.selectionType = ACCOUNT

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode)
      // show account picker
      this.$router.push({ name: 'accounts' })
    },
    /**
     * Add account to the favourites list.
     */
    async addAccount(accountName: string) {
      // load favourites
      let favArray = await settings.get(SettingKeys.favouriteAccounts)

      if (!favArray) {
        // initialize favourites
        favArray = []
      }

      // append this one
      favArray.push(accountName)

      // save
      await settings.set(SettingKeys.favouriteAccounts, favArray)
      await this.loadData()
    },

    async confirmDeleteAll() {
      // clear all favourites
      await settings.set(SettingKeys.favouriteAccounts, [])
      await this.loadData()
    },
    finalize(reset: any) {
      this.timer = setTimeout(() => {
        // has it been already deleted?
        if (!this.resetSlide) return

        reset()
      }, 2000)
    },
    /**
     * Handle selecting accounts
     */
    handleSelection() {
      let select = this.$store.state.selectModeMeta
      let id = select.selectedId

      // for now we only have accounts
      appService.db.accounts.get(id).then((account) => {
        // add to favourites
        this.addAccount(account.name)
      })

      // cleanup
      this.$store.commit(SET_SELECT_MODE, null)
    },
    async loadData() {
      try {
        let favArray = await appService.loadFavouriteAccounts()
        // load account details
        if (!favArray) {
          console.log('no favourite accounts selected yet')
          return
        }

        // adjust the balances
        const augmenter = new TransactionAugmenter()
        favArray = await augmenter.adjustAccountBalances(favArray)
        this.accounts = favArray
      } catch (error: any) {
        console.error(error)
        this.$q.notify({ color: 'secondary', message: error.message })
      }
    },
    onDeleteAllClick() {
      // confirm
      this.confirmDeleteDialogVisible = true
    },
    onFabClicked() {
      this.addAccountClick()
    },
    onListItemClick(accountName: string) {
      // console.log(accountName)
      this.$router.push({ name: 'register', params: { name: accountName } })
    },
    onRightSlide({ reset }) {
      this.resetSlide = reset
      this.finalize(reset)
    },
    onSortClick() {
      this.$router.push({ name: 'favreorder' })
    },
    async removeAccount(index: number) {
      if (this.resetSlide) {
        // remove the slide section.
        this.resetSlide()
        this.resetSlide = null
      }

      // remove the account from array
      this.accounts.splice(index, 1)

      // save favourites
      settings.get(SettingKeys.favouriteAccounts).then((favArray) => {
        if (!favArray) {
          // initialize favourites
          favArray = []
        }

        // append this one
        favArray.splice(index, 1)
        // save
        settings
          .set(SettingKeys.favouriteAccounts, favArray)
          .then(() => this.loadData())
      })
    },
  },
}
</script>
