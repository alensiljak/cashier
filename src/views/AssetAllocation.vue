<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round @click="menuClicked" aria-label="Menu" icon="menu"/>

        <q-toolbar-title>Asset Allocation</q-toolbar-title>

        <!-- <q-space/> -->

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <q-item clickable v-close-popup @click="onSetupClick">
                <q-item-section>Setup</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="cog" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onShareClick" v-if="canShare">
                <q-item-section>Share</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="sign-out-alt" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onHelpClick">
                <q-item-section>Help</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="question-circle" transform="grow-9 left-5"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div>
      <q-btn @click="onRecalculateClick" color="red-10" text-color="accent" label="Recalculate"/>
    </div>

    <!-- <q-table title="Asset Allocation" :data="assetClasses" :columns="columns" 
      dark color="amber-3" :dense="$q.screen.lt.md" :rows-per-page-options="[0, 20]"
      row-key="fullname">
    </q-table> -->
    <div style="height: 100%; width: 100%; overflow: scroll;">
      <table>
        <thead>
          <tr>
            <th>Asset Class</th>
            <th>Allocation</th>
            <th>Current</th>
            <th>Diff.</th>
            <th>Diff. %</th>
            <th>Alloc. Value</th>
            <th>Current Val.</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assetClass in assetClasses" :key="assetClass.fullname">
            <!-- Asset Class Name -->
            <td>
              <span :style="{ paddingLeft: assetClass.depth + 'rem'}"></span>
              {{ assetClass.name }}
            </td>
            <td class="text-right">{{ assetClass.allocation }}</td>
            <td class="text-right">{{ assetClass.currentAllocation }}</td>
            <!-- difference -->
            <td class="text-right" style="width: 3rem;">{{ assetClass.diff }}</td>
            <!-- difference % -->
            <td
              class="text-right" style="width: 3.5rem;"
              v-bind:class="{ 
              'text-red-10': assetClass.diffPerc < -20,
              'text-red-3': (-20 < assetClass.diffPerc && assetClass.diffPerc < 0),
              'text-green-3': (assetClass.diffPerc > 0 && assetClass.diffPerc < 20),
              'text-green-9': assetClass.diffPerc > 20 
              }"
            >{{ assetClass.diffPerc }}</td>
            <!-- Allocated Value -->
            <td class="text-right">{{ assetClass.allocatedAmount }}</td>
            <!-- Current Value -->
            <td class="text-right" style="width: 5.5rem;">{{ assetClass.currentValue }}</td>
            <td
              class="text-right"
              v-bind:class="{ 
              'text-red-10': assetClass.diff < -20,
              'text-red-3': assetClass.diff < 0,
              'text-green-3': assetClass.diff > 0,
              'text-green-9': assetClass.diff > 20 
              }"
            >{{ assetClass.diffAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from "../mutations";
import { engine } from "../lib/AssetAllocation";

export default {
  data() {
    return {
      assetClasses: [],
      columns: [
        { name: 'name', label: 'Asset Class', align: 'left', field: 'name', 
          format: val => `${val}`, classes: 'bg-teal-9 ellipsis' },
        { name: 'allocation', label: 'Allocation', field: 'allocation' },
        { name: 'current-allocation', label: 'Current', field: 'currentAllocation' },
        { name: 'diff', label: 'Diff', field: 'diff' },
        { name: 'diff-perc', label: 'Diff %', field: 'diffPerc' },
        { name: 'allocatedAmount', label: 'Alloc.Value', field: 'allocatedAmount' },
        { name: 'currentValue', label: 'Current', field: 'currentValue' },
        { name: 'diffAmount', label: 'Difference', field: 'diffAmount' }
      ]
    };
  },

  created() {
    // todo check if there is a definition saved
    // if not, redirect to the setup
    //this.$router.push({ name: 'assetallocationsetup' })

    this.$store.commit(MAIN_TOOLBAR, false);
    // this.$store.commit(SET_TITLE, "Asset Allocation");
  },

  methods: {
    loadData() {
      engine
        .loadFullAssetAllocation()
        .then(result => (this.assetClasses = result))
        .catch(reason => this.$q.notify({ message: reason }));
    },
    menuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    },
    /**
     * Export aa
     */
    onShareClick() {
      let dateFormatted = "today"
      navigator.share({
        title: 'Asset Allocation ' + dateFormatted,
        text: 'asset allocation goes here',
        url: 'https://cashier.alensiljak.ml/'
      })
    },
    onHelpClick() {
      // navigate to help page
      this.$router.push({ name: "assetallocationhelp" });
    },
    onRecalculateClick() {
      this.loadData();
    },
    onSetupClick() {
      this.$router.push({ name: "assetallocationsetup" });
    }
  },

  computed: {
    canShare() {
      return navigator && ('share' in navigator)
    }
  }
};
</script>
