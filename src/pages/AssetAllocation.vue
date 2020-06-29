<template>
  <q-page padding class="bg-colour1 text-colour2">
    <q-header elevated class="glossy">
      <q-toolbar class="text-colour2">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="menuClicked" />

        <q-toolbar-title>Asset Allocation</q-toolbar-title>

        <!-- <q-space/> -->

        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dark style="min-width: 175px" class="bg-colour1">
              <q-item v-close-popup clickable @click="onSetupClick">
                <q-item-section>Setup</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="cog" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>

              <q-item v-if="canShare" v-close-popup clickable @click="onShareClick">
                <q-item-section>Share</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="share-alt" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onExportClick">
                <q-item-section>Export</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="sign-out-alt" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onValidateClick">
                <q-item-section>Validate</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="balance-scale" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="onHelpClick">
                <q-item-section>Help</q-item-section>
                <q-item-section side>
                  <font-awesome-icon icon="question-circle" transform="grow-9 left-5" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div ref="buttonContainer">
      <q-btn color="red-10" text-color="accent" label="Recalculate" @click="onRecalculateClick" />
    </div>

    <!-- <q-table title="Asset Allocation" :data="assetClasses" :columns="columns"
      dark color="amber-3" :dense="$q.screen.lt.md" :rows-per-page-options="[0, 20]"
      row-key="fullname">
    </q-table>-->
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
              <span :style="{ paddingLeft: assetClass.depth + 'rem'}" />
              <router-link
                :to="{name: 'assetclassdetail', params: {fullname: assetClass.fullname}}"
              >
                {{ assetClass.name }}
              </router-link>
            </td>
            <td class="text-right">{{ assetClass.allocation }}</td>
            <td class="text-right">{{ assetClass.currentAllocation }}</td>
            <!-- difference -->
            <td class="text-right" style="width: 3rem;">{{ assetClass.diff }}</td>
            <!-- difference % -->
            <td
              class="text-right"
              style="width: 3.5rem;"
              :class="{
                'text-red-10': assetClass.diffPerc < -20,
                'text-red-3': (-20 < assetClass.diffPerc && assetClass.diffPerc < 0),
                'text-green-3': (assetClass.diffPerc > 0 && assetClass.diffPerc < 20),
                'text-green-9': assetClass.diffPerc > 20
              }"
            >
              {{ assetClass.diffPerc }}
            </td>
            <!-- Allocated Value -->
            <td class="text-right">{{ assetClass.allocatedValue }}</td>
            <!-- Current Value -->
            <td class="text-right" style="width: 5.5rem;">{{ assetClass.currentValue }}</td>
            <td
              class="text-right"
              :class="{
                'text-red-10': assetClass.diff < -20,
                'text-red-3': assetClass.diff < 0,
                'text-green-3': assetClass.diff > 0,
                'text-green-9': assetClass.diff > 20
              }"
            >
              {{ assetClass.diffAmount }}
            </td>
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
        {
          name: "name",
          label: "Asset Class",
          align: "left",
          field: "name",
          format: val => `${val}`,
          classes: "bg-teal-9 ellipsis"
        },
        { name: "allocation", label: "Allocation", field: "allocation" },
        {
          name: "current-allocation",
          label: "Current",
          field: "currentAllocation"
        },
        { name: "diff", label: "Diff", field: "diff" },
        { name: "diff-perc", label: "Diff %", field: "diffPerc" },
        {
          name: "allocatedAmount",
          label: "Alloc.Value",
          field: "allocatedAmount"
        },
        { name: "currentValue", label: "Current", field: "currentValue" },
        { name: "diffAmount", label: "Difference", field: "diffAmount" }
      ]
    };
  },

  computed: {
    canShare() {
      return navigator && "share" in navigator;
    }
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);
  },

  methods: {
    downloadAsFile(content) {
      var a = document.createElement("a");

      // filename
      let now = new Date();
      let filename = "asset_allocation-";
      filename += now.toISOString().substring(0, 10);
      filename += "_";
      filename += ("" + now.getHours()).padStart(2, "0");
      filename += "-";
      filename += ("" + now.getMinutes()).padStart(2, "0");
      // filename += now.getTimezoneOffset()
      filename += ".txt";
      a.download = filename;

      let encoded = btoa(content);
      // a.href = "data:application/octet-stream;base64," + Base64.encode(this.output);
      a.href = "data:text/plain;base64," + encoded;
      // charset=UTF-8;

      this.$refs.buttonContainer.appendChild(a);
      a.click();

      // cleanup?
      this.$refs.buttonContainer.removeChild(a);
    },
    getAaForExport() {
      // let output = JSON.stringify(this.assetClasses);
      let output = engine.formatAllocationRowsForTxtExport(this.assetClasses);

      return output;
    },
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
    onExportClick() {
      let output = this.getAaForExport();
      this.downloadAsFile(output);
    },
    onHelpClick() {
      // navigate to help page
      this.$router.push({ name: "assetallocationhelp" });
    },
    onRecalculateClick() {
      this.loadData();
    },
    onSetupClick() {
      this.$router.push({ name: "settings" });
    },
    onShareClick() {
      // prepare for export?
      let output = this.getAaForExport();

      let dateFormatted = "today";
      navigator.share({
        title: "Asset Allocation " + dateFormatted,
        text: output,
        url: "https://cashier.alensiljak.eu.org/"
      });
    },
    /**
     * validate the allocation (definition)
     */
    onValidateClick() {
      if (this.assetClasses.length === 0) {
        this.$q.notify({ message: "Please recalculate the allocation first." });
      }

      // confirm that the group allocations match the sum of the children's allocation.
      let errors = engine.validate(engine.assetClassIndex);
      if (errors.length > 0) {
        let message = "Errors: ";
        for (let i = 0; i < errors.length; i++) {
          message += errors[i];
        }
        this.$q.notify({ message: message, color: "red-10" });
      } else {
        this.$q.notify({
          message: "The allocation is valid.",
          color: "teal-9"
        }); // teal
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/palette.scss";
a {
  color: $colour2;
  //color: $amber-2;
}
</style>
