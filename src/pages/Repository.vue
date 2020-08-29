<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>
      Various operations on the Ledger git repository.
    </p>
    <p>
      All operations are performed by CashierSync, so this functionality is available
      only in Live Mode. The repository must be set up manually, with the correct remote
      set up.
    </p>

    <div>
      <div class="q-my-sm">
        <q-input v-model="repoPath" type="text" class="text-red" dark clearable 
                 label="Repository path" 
                 @change="onRepoChange"
        />
      </div>
    </div>

    <div>
      <p>
        Pull changes from the remote repository.
      </p>
      <div class="text-center">
        <q-btn color="secondary" text-color="accent" @click="onPullClick">
          <font-awesome-icon icon="download" transform="grow-6 right-6" class="q-mr-sm" />
          <span class="q-ml-sm">Pull</span>
        </q-btn>
      </div>
    </div>

    <!-- commit -->
    <div class="q-my-md">
      <p>
        Commit changes to the local repository.
      </p>
      <div class="q-my-sm">
        <q-input type="text" class="text-red" dark clearable label="Commit message" />
      </div>
      <div class="text-center">
        <q-btn color="secondary" text-color="accent">
          <font-awesome-icon icon="save" transform="grow-6 right-6" class="q-mr-sm" />
          <span class="q-ml-sm">Commit</span>
        </q-btn>
      </div>
    </div>

    <div>
      <p>
        Push changes from the remote repository.
      </p>
      <div class="text-center">
        <q-btn color="secondary" text-color="accent" @click="onPushClick">
          <font-awesome-icon icon="upload" transform="grow-6 right-6" class="q-mr-sm" />
          <span class="q-ml-sm">Push</span>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import { SettingKeys, settings } from "../lib/Configuration";
import { CashierSync } from "../lib/syncCashier";

export default {
    data() {
        return {
            serverUrl: null,
            repoPath: null
        }
    },

    created() {
        this.$store.commit(SET_TITLE, "Repository");
        this.$store.commit(MAIN_TOOLBAR, true);

        // load settings.
      settings
        .get(SettingKeys.syncServerUrl)
        .then(value => this.serverUrl = value);
      settings
        .get(SettingKeys.repositoryPath)
        .then(value => this.repoPath = value)
    },

    methods: {
        /**
         * pull the book changes
         */
        onPullClick() {
            // run the cashiersync service for git pull.
            const sync = new CashierSync(this.serverUrl);
            sync.repoPull(this.repoPath)
                .then(result => this.$q.notify(result))
                .catch(error => this.$q.notify(error))
        },
        onPushClick() {
            
        },
        onRepoChange() {
            // this.$q.notify(this.repoPath)
            settings.set(SettingKeys.repositoryPath, this.repoPath)
                .then(() => this.$q.notify("path saved"))
                .catch(error => this.$q.notify(error))
        }
    }
}
</script>