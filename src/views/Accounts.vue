<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Accounts</q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <q-icon name="sync"/>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Import</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <p>Accounts</p>
    <p>Show the list of accounts used. Sync from this page directly?</p>

    <!-- Account list -->
    <q-list bordered separator>
      <q-item clickable v-ripple v-for="account in accounts" :key="account.name">
        <q-item-section>{{ account.name }}</q-item-section>
      </q-item>
    </q-list>

    <!-- new account dialog -->
    <q-dialog dark v-model="dialogVisible">
      <!-- persistent -->
      <form @submit.prevent="onAddAccount">
      <q-card style="min-width: 400px" class="bg text-colour2">
        <q-card-section>
          <div class="text-h6">New Account</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="newAccount" autofocus @keyup.enter="prompt = false"
            input-class="text-amber-2"/>
        </q-card-section>

        <q-card-actions align="right" class="text-accent">
          <q-btn flat label="Cancel" v-close-popup type="button" @click="onCancelAdd" />
          <q-btn flat label="Add" v-close-popup type="submit" @click="onAddAccount"/>
        </q-card-actions>
      </q-card>
      </form>
    </q-dialog>

    <!-- floating action button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" text-color="secondary" @click="onFab"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER, MAIN_TOOLBAR } from "../mutations";
import appService from '../appService'

export default {
  data() {
    return {
      dialogVisible: false,
      newAccount: null,
      accounts: null
    }
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    this.loadData()
  },

  methods: {
    loadData() {
      appService.loadAccounts().toArray().then(accounts => this.accounts = accounts)
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onAddAccount() {
      // create new account
      if (!this.newAccount) return;

      appService.createAccount(this.newAccount)
        .then(() => {
          this.newAccount = null
          // console.log(value)
          this.loadData()
        })
    },
    onCancelAdd() {
      this.dialogVisible = false
      this.newAccount = null
    },
    onFab() {
      // New Account
      this.dialogVisible = true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/palette.scss';

.bg {
  background-color: $colour1;
}
</style>
