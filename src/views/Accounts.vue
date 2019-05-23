<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="fas fa-bars"/>

        <q-toolbar-title>Accounts</q-toolbar-title>

        <q-space />
        <!-- search -->
        <q-input label="Search" v-if="searchVisible" v-model="filter" dark color="amber-4" />
        <q-btn flat round dense icon="fas fa-search" class="q-mr-xs"
          @click="searchVisible = !searchVisible" />

        <q-btn flat round dense icon="fas fa-ellipsis-v">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <q-icon name="fas fa-sync-alt"/>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="onImportClick">Import</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Account list -->
    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        v-for="account in accounts"
        :key="account.id"
        :to="{ name: 'account', params: { id: account.id }}"
      >
        <q-item-section>{{ account.name }}</q-item-section>
        <q-item-section side>{{ account.balance }} {{ account.currency }}</q-item-section>

        <!-- list item context menu -->
        <q-menu touch-position context-menu content-class="bg-teal-9 text-amber-2">
          <q-list dense style="min-width: 10rem">
            <q-item clickable v-close-popup>
              <q-item-section @click="onDeleteAccount(account.id)">Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
    </q-list>

    <!-- new account (name) dialog -->
    <q-dialog dark v-model="dialogVisible">
      <!-- persistent -->
      <q-card style="min-width: 400px" class="bg text-colour2">
        <q-card-section>
          <div class="text-h6">New Account</div>
        </q-card-section>

        <q-card-section>
          <q-input
            dense
            v-model="newAccount"
            autofocus
            @keyup.enter="onAddAccount"
            input-class="text-amber-2"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-accent">
          <q-btn flat label="Cancel" v-close-popup @click="onCancelAdd"/>
          <q-btn flat label="Add" v-close-popup @click="onAddAccount"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="fas fa-plus" color="accent" text-color="secondary" @click="onFab"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER, MAIN_TOOLBAR } from "../mutations";
import appService from "../appService";

export default {
  data() {
    return {
      dialogVisible: false,
      newAccount: null,
      accounts: null,
      searchVisible: false,
      filter: null, // filter for the account name
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    this.loadData();
  },

  methods: {
    loadData() {
      appService
        .loadAccounts()
        .toArray()
        .then(accounts => (this.accounts = accounts));
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onAddAccount() {
      // create new account
      if (!this.newAccount) return;
      this.dialogVisible = false;

      appService.createAccount(this.newAccount).then(() => {
        // reset the new account name.
        this.newAccount = null;

        this.loadData();
      });
    },
    onCancelAdd() {
      this.dialogVisible = false;
      this.newAccount = null;
    },
    onDeleteAccount(accountName) {
      // console.log(event);
      appService.deleteAccount(accountName).then(() => {
        this.loadData();
      });
    },
    onFab() {
      // New Account
      this.dialogVisible = true;
    },
    onImportClick() {
      this.$router.push({ name: "import" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/palette.scss";

.bg {
  background-color: $colour1;
}
</style>
