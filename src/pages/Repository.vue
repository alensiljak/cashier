<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar :title="'Repository'" />

    <p>Various operations on the Ledger git repository.</p>
    <p>
      All operations are performed by CashierSync, so this functionality is
      available only in Live Mode. The repository must be set up manually, with
      the correct remote set up.
    </p>

    <!-- prices -->
    <q-card dark bordered class="q-px-sm text-colour2 rounded-border q-mb-md">
      <q-card-section>
        <p class="text-h5">Prices</p>
        <q-input
          v-model="pricesRepoPath"
          type="text"
          class="text-red"
          dark
          clearable
          label="Prices repository path"
          @change="onPricesRepoChange"
        />
      </q-card-section>
      <q-separator dark />
      <q-card-actions>
        <q-btn color="secondary" text-color="accent" @click="pricesRepoPull">
          <font-awesome-icon
            icon="download"
            transform="grow-6 right-6"
            class="q-mr-sm"
          />
          <span class="q-ml-sm">Pull</span>
        </q-btn>
      </q-card-actions>
    </q-card>

    <!-- Journal section -->
    <div>
      <span class="text-h5">Journal</span>
      <p>
        This is the repository that contains the book / journal. Used as the
        main data source, configured in .ledgerrc.
      </p>
    </div>

    <!-- Repo path -->
    <div>
      <p>Add the relative path to the book / journal repository.</p>
      <div class="q-my-sm">
        <q-input
          v-model="repoPath"
          type="text"
          class="text-red"
          dark
          clearable
          label="Repository path"
          @change="onRepoChange"
        />
      </div>
    </div>

    <!-- pull / push operations -->
    <div class="row">
      <div class="col text-center">
        <!-- Pull -->
        <q-btn color="secondary" text-color="accent" @click="onPullClick">
          <font-awesome-icon
            icon="download"
            transform="grow-6 right-6"
            class="q-mr-sm"
          />
          <span class="q-ml-sm">Pull</span>
        </q-btn>
      </div>
      <!-- Push -->
      <div class="col text-center">
        <q-btn color="secondary" text-color="accent" @click="onPushClick">
          <font-awesome-icon
            icon="upload"
            transform="grow-6 right-6"
            class="q-mr-sm"
          />
          <span class="q-ml-sm">Push</span>
        </q-btn>
      </div>
    </div>

    <!-- commit -->
    <div class="q-my-md">
      <p>Commit changes to the local repository.</p>
      <p class="q-my-md">
        Set the path to the writeable file, to which to append the transactions.
        The path is relative to the start location of the CashierSync. Example:
        book/sync.ledger
      </p>
      <div class="q-my-sm">
        <q-input
          ref="input"
          v-model="commitMessage"
          type="text"
          class="text-red"
          dark
          clearable
          :rules="[(val) => !!val || 'Field is required']"
          label="Commit message"
        />
      </div>
      <div class="text-center">
        <q-btn color="secondary" text-color="accent" @click="onCommitClick">
          <font-awesome-icon
            icon="save"
            transform="grow-6 right-6"
            class="q-mr-sm"
          />
          <span class="q-ml-sm">Commit</span>
        </q-btn>
      </div>
    </div>

    <!-- status -->
    <div>
      Status
      <pre>{{ gitStatus }}</pre>
      <div class="row">
        <div class="col">
          <q-btn color="secondary" text-color="accent" @click="onRefreshClick">
            <font-awesome-icon
              icon="sync-alt"
              transform="grow-6 right-6"
              class="q-mr-sm"
            />
            <span class="q-ml-sm">Refresh</span>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import Toolbar from '../components/CashierToolbar.vue'
import { SettingKeys, settings } from '../lib/Configuration'
import { CashierSync } from '../lib/syncCashier'

export default {
  components: {
    Toolbar,
  },
  data() {
    return {
      commitMessage: null,
      gitStatus: 'Not refreshed yet.',
      serverUrl: null,
      repoPath: null,
      pricesRepoPath: null,
    }
  },

  created() {
    this.loadSettings()
  },

  methods: {
    loadSettings() {
      settings
        .get(SettingKeys.syncServerUrl)
        .then((value) => (this.serverUrl = value))
      settings
        .get(SettingKeys.repositoryPath)
        .then((value) => (this.repoPath = value))
      settings
        .get(SettingKeys.pricesRepositoryPath)
        .then((value) => (this.pricesRepoPath = value))
    },
    onCommitClick() {
      // the commit message is mandatory
      if (!this.commitMessage) {
        this.$q.notify({
          message: 'The commit message is mandatory!',
          color: 'secondary',
        })
        return
      }
      const sync = new CashierSync(this.serverUrl)
      sync
        .repoCommit(this.repoPath, this.commitMessage)
        .then((result) => this.$q.notify(result))
        .catch((error) =>
          this.$q.notify({ message: error, color: 'secondary' })
        )
    },
    async onPricesRepoChange() {
      try {
        await settings.set(
          SettingKeys.pricesRepositoryPath,
          this.pricesRepoPath
        )
        this.$q.notify('prices path saved')
      } catch (error) {
        this.$q.notify(error)
      }
    },
    /**
     * pull the book changes
     */
    async onPullClick() {
      // run the cashiersync service for git pull.
      try {
        const sync = new CashierSync(this.serverUrl)
        const result = await sync.repoPull(this.repoPath)
        this.$q.notify({ message: result, color: 'primary' })
      } catch (error) {
        this.$q.notify({ message: error, color: 'secondary' })
      }
    },
    onPushClick() {
      const sync = new CashierSync(this.serverUrl)
      sync
        .repoPush(this.repoPath)
        .then((result) => this.$q.notify({ message: result, color: 'primary' }))
        .catch((error) =>
          this.$q.notify({ message: error, color: 'secondary' })
        )
    },
    onRepoChange() {
      // this.$q.notify(this.repoPath)
      settings
        .set(SettingKeys.repositoryPath, this.repoPath)
        .then(() => this.$q.notify('journal path saved'))
        .catch((error) =>
          this.$q.notify({ message: error, color: 'secondary' })
        )
    },
    async onRefreshClick() {
      // Refresh the repository status.
      try {
        const sync = new CashierSync(this.serverUrl)
        this.gitStatus = await sync.repoStatus(this.repoPath)
      } catch (error) {
        this.$q.notify({ message: error, color: 'secondary' })
      }
    },
    pricesRepoPull() {
      const sync = new CashierSync(this.serverUrl)
      sync
        .repoPull(this.pricesRepoPath)
        .then((result) => this.$q.notify({ message: result, color: 'primary' }))
        .catch((error) =>
          this.$q.notify({ message: error, color: 'secondary' })
        )
    },
  },
}
</script>