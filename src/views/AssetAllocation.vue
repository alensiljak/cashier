<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Asset Allocation</q-toolbar-title>

        <q-space/>

        <q-btn flat round dense @click="onHelpClick">
          <font-awesome-icon icon="question-circle"/>
        </q-btn>

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <q-item clickable v-close-popup @click="onSetupClick">
                <q-item-section>Setup</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="cog" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div>
      <q-btn
        label="Read Accounts"
        color="secondary"
        text-color="accent"
        @click="readAccountsClick"
      />
    </div>

    <div>
        <!-- {{allocation}} -->
        <div v-for="assetClass in allocationContainer" :key="assetClass.full_name">
          {{ assetClass.depth }},
            {{ assetClass.parentName }}, {{ assetClass.name }},
            {{ assetClass.allocation }}, {{assetClass.stocks}}
        </div>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from "../mutations";
import { engine } from "../lib/AssetAllocation";
// import { settings, SettingKeys } from '../lib/Configuration';

export default {
    data() {
        return {
            allocationContainer: null
        }
    },

  created() {
    // todo check if there is a definition saved
    // if not, redirect to the setup
    //this.$router.push({ name: 'assetallocationsetup' })

    this.$store.commit(MAIN_TOOLBAR, false);
    // this.$store.commit(SET_TITLE, "Asset Allocation");

    this.loadData()
  },

  methods: {
    loadData() {
      // load aa definition
      this.loadDefinition()
      // todo load current balances
      // todo load accounts
      // todo add the balances to asset classes
      // todo calculate offsets
    },
    loadDefinition() {
        engine.loadDefinition()
            .then(allocation => this.allocationContainer = allocation)
            .catch(reason => this.$q.notify({message: reason}))
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    onHelpClick() {
      // navigate to help page
      this.$router.push({ name: "assetallocationhelp" });
    },
    onSetupClick() {
      this.$router.push({ name: "assetallocationsetup" });
    },
    readAccountsClick() {
      engine
        .getInvestmentAccounts()
        .then(accounts => {
          console.log(accounts);
        })
        .catch(reason => this.$q.notify({ message: reason }));
    }
  }
};
</script>
