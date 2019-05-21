<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Account</q-toolbar-title>

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

    <p>Editor for the Account: {{ account.name }}</p>

    <q-input label="Account Name" v-model="account.name" dark/>
    <q-input label="Balance" v-model="account.balance" dark/>
    <q-input label="Currency" v-model="account.currency" dark/>

    <!-- Actions -->
    <div class="row q-mt-xl justify-end">
      <div class="col text-center">
        <q-btn color="secondary" text-color="accent" label="Cancel" size="medium" @click="onCancel"/>
      </div>
      <div class="col text-center">
        <q-btn class="q-px-lg" color="accent" text-color="secondary" label="Save" size="medium"
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

    let accountName = this.$route.params.id;
    this.loadAccount(accountName);
  },

  methods: {
    loadAccount(name) {
      appService.loadAccount(name).then(account => {
        this.account = account;
        // console.log('loaded account:', account)
      });
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onCancel() {
      this.$router.push({name: 'accounts'})
    },
    onSave() {
      // todo save account
      appService.saveAccount(this.account).then(() => {
        this.$router.push({name: 'accounts'})
      })
    }
  }
};
</script>
