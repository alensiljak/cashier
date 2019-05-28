<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>AA Setup</q-toolbar-title>

        <q-space/>

        <q-btn flat round dense @click="onHelpClick">
          <font-awesome-icon icon="question-circle"/>
        </q-btn>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <!-- dense -->
              <q-item clickable v-close-popup>
                <q-item-section>Synchronize</q-item-section>
                <q-item-section side>
                  <!-- <q-icon name="sync"/> -->
                  <font-awesome-icon icon="sync-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section @click="onImportClick">Import</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="sign-in-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section @click="onDeleteAllClick">Delete All</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="trash-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div>
      <p>Asset Allocation Setup</p>

    </div>

    <div>
      <q-input label="Root investment account to use" dark/>
    </div>

    <div class="q-my-md text-right">
      <q-btn label="Save" color="red-10" text-color="amber-4"/>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "AA Setup");

    // this.dlPrice()
  },

  methods: {
    onHelpClick() {
      // todo navigate to help page
      this.$router.push({ name: 'assetallocationsetuphelp' })
    }
  }
};
</script>
