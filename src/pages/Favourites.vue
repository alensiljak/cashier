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

        <q-toolbar-title>Favourites</q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item v-close-popup clickable @click="addAccountClick">
                <q-item-section>Add</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="plus-circle"
                    transform="grow-9 left-5"
                  />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onDeleteAllClick">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="trash-alt"
                    transform="grow-9 left-5"
                  />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onSortClick">
                <q-item-section>Reorder</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="sort" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- account list -->
    <q-slide-item
      v-for="(account, index) in accounts"
      :key="account.name"
      dark
      right-color="secondary"
      @right="onRightSlide"
    >
      <template #right>
        <div
          class="row items-center text-accent"
          @click="removeAccount(index)"
        >
          Click to confirm or wait 2s to cancel
          <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
        </div>
      </template>

      <q-list dark separator class="text-colour2">
        <q-item v-ripple clickable class="q-px-none" @click="onListItemClick(account.name)">
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>
            {{ account.balance }} {{ account.currency }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-slide-item>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog
      v-model="confirmDeleteDialogVisible"
      persistent
      content-class="bg-blue-grey-10"
    >
      <q-card dark class="bg-secondary text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to unmark all the favourite accounts?</span>
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
import { SET_SELECT_MODE, TOGGLE_DRAWER } from '../mutations'
import {
  SelectionModeMetadata,
  settings,
  SettingKeys,
} from '../lib/Configuration'
import appService from '../appService'

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
    let meta = this.$store.getters.selectionModeMeta
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
    addAccount(accountName) {
      // load favourites
      settings.get(SettingKeys.favouriteAccounts).then((favArray) => {
        if (!favArray) {
          // initialize favourites
          favArray = []
        }

        // append this one
        favArray.push(accountName)
        // save
        settings
          .set(SettingKeys.favouriteAccounts, favArray)
          .then(() => this.loadData())
      })
    },
    async adjustBalances(accounts) {
      if (!accounts) {
        console.info('no favourite accounts found for balance adjustment')
        return
      }

      for (let i = 0; i < accounts.length; i++) {
        // load all postings for the account
        let account = accounts[i]
        // todo: if the favourite account is not found, gray it out?
        if (!account || !account.balance) continue // null check

        let sum = parseFloat(account.balance)
        if (!sum) continue

        let postings = await appService.db.postings.where({
          account: account.name,
        })
        let postingsArray = await postings.toArray()
        for (let j = 0; j < postingsArray.length; j++) {
          let amount = postingsArray[j].amount
          if (!amount) continue
          if (typeof amount === 'string') {
            amount = parseFloat(amount)
          }

          sum += amount
        }

        if (isNaN(sum)) {
          console.warn('The sum for ' + account.name + ' is not a number: ', sum)
        }

        let newBalance = sum.toFixed(2)

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
        account.balance = new Intl.NumberFormat('en-AU') // { style: 'currency', currency: 'EUR' }
          .format(newBalance)
      }
      return accounts
    },
    async confirmDeleteAll() {
      // clear all favourites
      await settings.set(SettingKeys.favouriteAccounts, [])
      await this.loadData()
    },
    finalize(reset) {
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
      let select = this.$store.getters.selectionModeMeta
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

        // adjust the balance
        favArray = await this.adjustBalances(favArray)
        this.accounts = favArray
      } catch (reason) {
        console.error(reason)
        this.$q.notify({ color: 'secondary', message: reason.message })
      }
    },
    menuClicked() {
      let visible = this.$store.getters.drawerOpen
      this.$store.commit(TOGGLE_DRAWER, !visible)
    },
    onDeleteAllClick() {
      // confirm
      this.confirmDeleteDialogVisible = true
    },
    onFabClicked() {
      this.addAccountClick()
    },
    onListItemClick(accountName) {
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
    async removeAccount(index) {
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
