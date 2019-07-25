<template>
  <q-page padding class="bg-colour1 text-colour2">
    <accounts-list lockAxis="y" v-model="accounts">
      <account-item
        v-for="(account, index) in accounts"
        :index="index"
        :key="index"
        :account="account"
      />
    </accounts-list>

    <div class="row q-my-xl justify-end">
      <q-btn color="red-10" text-color="amber-4" label="Save" @click="onSaveClick" />
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import AccountsList from "../components/SortableAccountsList";
import AccountItem from "../components/SortableAccountItem";
import { settings, SettingKeys } from "../lib/Configuration";
import appService from "../appService";

export default {
  data() {
    return {
      accounts: []
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "Reorder Favourites");

    this.loadData();
  },

  methods: {
    loadData() {
      settings.get(SettingKeys.favouriteAccounts).then(favArray => {
        // load account details
        if (!favArray) {
          console.log("no favourite accounts selected yet");
          return;
        }

        appService.db.accounts
          .bulkGet(favArray)
          .then(accounts => (this.accounts = accounts))
          .catch(reason => {
            this.$q.notify({ color: "red-10", message: reason.message });
          });
      });
    },
    onSaveClick() {
        // get the list of account names
        let names = []
        for(let i = 0; i < this.accounts.length; i++) {
            names.push(this.accounts[i].name)
        }

      settings
        .set(SettingKeys.favouriteAccounts, names)
        .then(() => this.loadData())
        .then(() => this.$q.notify('data saved'))
    }
  },

  components: {
    AccountsList,
    AccountItem
  }
};
</script>
