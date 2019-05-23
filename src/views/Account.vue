<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="fas fa-bars"/>

        <q-toolbar-title>Account</q-toolbar-title>

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
                <q-item-section>Import</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="deleteAccount">Delete</q-item-section>
                <q-item-section side>
                  <q-icon name="fas fa-trash-alt"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <p>Editor for the Account: {{ account.name }}</p>

    <q-input
      label="Account Name"
      v-model="account.name"
      dark
      clearable
      @keyup.enter="onEnter"
      clear-icon="fas fa-times-circle"
    />
    <!-- balance -->
    <q-input
      label="Balance"
      v-model.number="account.balance"
      type="number"
      dark
      clearable
      clear-icon="fas fa-times-circle"
      @keyup.enter="onEnter"
    />
    <q-input
      label="Currency"
      v-model="account.currency"
      dark
      clearable
      @keyup.enter="onEnter"
      clear-icon="fas fa-times-circle"
    />

    <!-- Actions -->
    <div class="row q-mt-xl justify-end">
      <div class="col text-center">
        <q-btn
          color="secondary"
          text-color="accent"
          label="Cancel"
          size="medium"
          @click="onCancel"
        />
      </div>
      <div class="col text-center">
        <q-btn
          class="q-px-lg"
          color="accent"
          text-color="secondary"
          label="Save"
          size="medium"
          @click="onSave"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { TOGGLE_DRAWER, MAIN_TOOLBAR } from "../mutations";
import appService from "../appService";

export default {
  data() {
    return {
      account: {}
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);

    this.loadAccount(this.$route.params.id);
  },

  methods: {
    deleteAccount() {
      // delete the account and go back
      appService.deleteAccount(this.account.id).then(() => history.go(-1));
    },
    loadAccount(id) {
      appService.loadAccount(id).then(account => {
        this.account = account;
        // console.log('loaded account:', account)
      });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onCancel() {
      this.$router.push({ name: "accounts" });
    },
    onEnter() {
      // Enter pressed in one of the fields. Save.
      this.onSave();
    },
    onSave() {
      // todo save account
      appService.saveAccount(this.account).then(() => {
        this.$router.push({ name: "accounts" });
      });
    }
  }
};
</script>
