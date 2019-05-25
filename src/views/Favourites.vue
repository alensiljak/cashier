<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Favourites</q-toolbar-title>

        <q-space/>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup @click="addAccountClick">
                <q-item-section>Add</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="plus-circle" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

              <q-item v-close-popup @click="onDeleteAllClick">
                <q-item-section>Delete All</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="trash-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-list dark separator>
      <q-item v-for="account in accounts" :key="account.name" clickable v-ripple>
        <q-item-section>{{ account.name }}</q-item-section>
        <q-item-section side>{{account.balance}} {{account.currency}}</q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab color="accent" text-color="secondary" @click="onFabClicked">
        <font-awesome-icon icon="plus" transform="grow-6" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_SELECT_MODE, TOGGLE_DRAWER } from "../mutations";
import { SelectionModeMetadata, settings, SettingKeys } from "../Configuration";
import appService from "../appService";

const ACCOUNT = "account";

export default {
  data() {
    return {
      accounts: []
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
      selectMode.originRoute = { name: "favouriteAccounts" };

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
        appService.db.accounts.bulkGet(favArray).then(accounts => {
          this.accounts = accounts
        })
        // this.accounts = favArray;
      });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onDeleteAllClick() {
      // todo confirm, etc.
    },
    onFabClicked() {
      this.$router.push({ name: "tx" });
    }
  }
};
</script>
