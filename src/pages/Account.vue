<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- toolbar -->
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="menuClicked"
        />

        <q-toolbar-title>Account</q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item v-close-popup clickable>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="sync-alt"
                    transform="grow-9 left-7"
                  />
                </q-item-section>
              </q-item>
              <q-item v-close-popup clickable>
                <q-item-section>Import</q-item-section>
                <q-item-section side>
                  <font-awesome-icon
                    icon="sign-in-alt"
                    transform="grow-9 left-7"
                  />
                </q-item-section>
              </q-item>
              <q-item v-close-popup clickable>
                <q-item-section @click="deleteAccount">Delete</q-item-section>
                <q-item-section side>
                  <!-- <q-icon name="star"/> -->
                  <font-awesome-icon
                    icon="trash-alt"
                    transform="grow-9 left-7"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- <p>Editor for the Account: {{ account.name }}</p> -->

    <q-input
      v-model="account.name"
      label="Account Name"
      clearable
      @keyup.enter="onEnter"
    />
    <!-- balance -->
    <q-input
      v-model.number="account.balance"
      label="Balance"
      type="number"
      clearable
      @keyup.enter="onEnter"
    />
    <q-input
      v-model="account.currency"
      label="Currency"
      clearable
      @keyup.enter="onEnter"
    />

    <q-input
      v-model="account.currentValue"
      label="Current value"
      clearable
      @keyup.enter="onEnter"
    />
    <q-input
      v-model="account.currentCurrency"
      label="Current value currency"
      clearable
      @keyup.enter="onEnter"
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

<script setup lang="ts">
import appService from '../appService'
import { useMainStore } from '../store/mainStore'

const mainStore = useMainStore()

function menuClicked() {
  mainStore.toggleDrawer()
}
</script>
<script lang="ts">
export default {
  data() {
    return {
      account: {},
      originalName: null, // track name change
    }
  },

  created() {
    this.loadAccount(this.$route.params.id)
  },

  methods: {
    async deleteAccount() {
      // delete the account and go back
      await appService.deleteAccount(this.account.name)
      history.go(-1)
    },
    async loadAccount(name) {
      this.originalName = name

      let account = await appService.loadAccount(name)
      this.account = account
    },
    onCancel() {
      this.$router.push({ name: 'accounts' })
    },
    onEnter() {
      // Enter pressed in one of the fields. Save.
      this.onSave()
    },
    async onSave() {
      var deleteOldAccount = false
      // check if the name was changed.
      if (this.account.name !== this.originalName) {
        // need to delete the old account
        deleteOldAccount = true
      }
      // save account
      await appService.saveAccount(this.account)
      if (deleteOldAccount) {
        await appService.deleteAccount(this.originalName)
        console.log('old account deleted', this.originalName)
      }
      this.$router.push({ name: 'accounts' })
    },
  },
}
</script>
