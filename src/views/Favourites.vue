<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu" />

        <q-toolbar-title>Favourites</q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup @click="addAccountClick">
                <q-item-section>Add</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="plus-circle" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onDeleteAllClick">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="trash-alt" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onSortClick">
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
      dark
      v-for="(account, index) in accounts"
      :key="account.name"
      right-color="red-10"
      @right="onRightSlide">
      <template v-slot:right>
        <div class="row items-center text-amber-4" @click="removeAccount(index)">
          Click to confirm or wait 2s to cancel
          <font-awesome-icon icon="trash-alt" size="2x" class="q-ml-md" />
        </div>
      </template>

      <q-list dark separator class="bg-colour1">
        <q-item clickable v-ripple @click="onListItemClick(account.name)">
          <q-item-section>{{ account.name }}</q-item-section>
          <q-item-section side>{{ account.balance}} {{account.currency}}</q-item-section>
        </q-item>
      </q-list>
    </q-slide-item>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>

    <!-- confirm deletion dialog -->
    <q-dialog v-model="confirmDeleteDialogVisible" persistent content-class="bg-blue-grey-10">
      <q-card dark class="bg-red-10 text-amber-2">
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="amber-2"/>
          <span class="q-ml-sm">You are currently not connected to any network.</span>-->
          <span>Do you want to delete the transaction?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="amber-4" v-close-popup />
          <q-btn flat label="Delete" color="amber-4" v-close-popup @click="confirmDeleteAll" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_SELECT_MODE, TOGGLE_DRAWER } from "../mutations";
import { SelectionModeMetadata, settings, SettingKeys } from "../lib/Configuration";
import appService from "../appService";

const ACCOUNT = "account";

export default {
  data() {
    return {
      accounts: [],
      confirmDeleteDialogVisible: false,
      resetSlide: null
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    if (this.$store.state.selectModeMeta) this.handleSelection();

    // load favourite accounts
    this.loadData();
  },

  methods: {
    addAccountClick() {
      // show the account picker
      let selectMode = new SelectionModeMetadata();

      // set the type
      selectMode.selectionType = ACCOUNT;
      // set the return route
      selectMode.originRoute = { name: "favourites" };

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode);
      // show account picker
      this.$router.push({ name: "accounts" });
    },
    /**
     * Add account to the favourites list.
     */
    addAccount(accountName) {
      // load favourites
      settings.get(SettingKeys.favouriteAccounts).then(favArray => {
        if (!favArray) {
          // initialize favourites
          favArray = [];
        }

        // append this one
        favArray.push(accountName);
        // save
        settings
          .set(SettingKeys.favouriteAccounts, favArray)
          .then(() => this.loadData());
      });
    },
    async adjustBalances(accounts) {
      if (!accounts) {
        console.info("no favourite accounts found for balance adjustment");
        return;
      }

      for (let i = 0; i < accounts.length; i++) {
        // load all postings for the account
        let account = accounts[i];
        // todo: if the favourite account is not found, gray it out?
        if (!account || !account.balance) continue; // null check

        let sum = parseFloat(account.balance);
        if (!sum) continue;

        let postings = await appService.db.postings.where({
          account: account.name
        });
        // .each(posting => {
        let postingsArray = await postings.toArray();
        for (let j = 0; j < postingsArray.length; j++) {
          let amount = postingsArray[j].amount;
          if (!amount) continue;

          sum += amount;
        }
        // })
        let newBalance = sum.toFixed(2);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
        account.balance = new Intl.NumberFormat("en-AU") // { style: 'currency', currency: 'EUR' }
          .format(newBalance);
      }
      return accounts;
    },
    confirmDeleteAll() {
      // todo delete all favourites
    },
    finalize(reset) {
      this.timer = setTimeout(() => {
        // has it been already deleted?
        if (!this.resetSlide) return;

        reset();
      }, 2000);
    },
    /**
     * Handle selecting accounts
     */
    handleSelection() {
      let select = this.$store.state.selectModeMeta;
      let id = select.selectedId;

      // for now we only have accounts
      appService.db.accounts.get(id).then(account => {
        // add to favourites
        this.addAccount(account.name);
      });

      // cleanup
      this.$store.commit(SET_SELECT_MODE, null);
    },
    loadData() {
      settings.get(SettingKeys.favouriteAccounts).then(favArray => {
        // load account details
        if (!favArray) {
          console.log("no favourite accounts selected yet");
          return;
        }

        appService.db.accounts
          .bulkGet(favArray)
          .then(accounts => {
            // adjust the balance
            this.adjustBalances(accounts).then(
              accounts => (this.accounts = accounts)
            );
          })
          .catch(reason => {
            this.$q.notify({ color: "red-10", message: reason.message });
          });
      });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onDeleteAllClick() {
      // confirm
      this.confirmDeleteDialogVisible = true;
    },
    onFabClicked() {
      this.$router.push({ name: "tx" });
    },
    onListItemClick(accountName) {
      // console.log(accountName)
      this.$router.push({ name: "register", params: { name: accountName } });
    },
    onRightSlide({ reset }) {
      this.resetSlide = reset;
      this.finalize(this.resetSlide);
    },
    onSortClick() {
      this.$router.push({ name: 'favreorder' })
    },
    removeAccount(index) {
      if (this.resetSlide) {
        // remove the slide section.
        this.resetSlide();
        this.resetSlide = null;
      }

      // remove the account from array
      this.accounts.splice(index, 1);

      // save favourites
      settings.get(SettingKeys.favouriteAccounts).then(favArray => {
        if (!favArray) {
          // initialize favourites
          favArray = [];
        }

        // append this one
        favArray.splice(index, 1);
        // save
        settings
          .set(SettingKeys.favouriteAccounts, favArray)
          .then(() => this.loadData());
      });
    }
  },
};
</script>
