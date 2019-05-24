<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Favourite Accounts</q-toolbar-title>

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
      <q-item v-for="accountName in accounts" :key="accountName" clickable v-ripple>
        <q-item-section>{{ accountName }}</q-item-section>
        <q-item-section side>balance</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_SELECT_MODE, TOGGLE_DRAWER } from "../mutations";
import appService from "@/appService";
import { SelectionModeMetadata, settings, SettingKeys } from "../Configuration";

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
        // todo load account details
        this.accounts = favArray;
      });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onDeleteAllClick() {
      // todo confirm, etc.
    }
  }
};
</script>
