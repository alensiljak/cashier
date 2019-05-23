<template>
  <q-page padding class="bg-colour1 text-colour2">
    <payees-toolbar
      title="Payees"
      @menuClicked="onMenuClicked"
      @createClicked="onCreateClicked"
      @deleteAllClicked="onDeleteAllClicked"
    />

    <p>List of payees</p>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, TOGGLE_DRAWER } from "@/mutations";
import PayeesToolbar from "@/components/PayeesToolbar";
import appService from "@/appService";

export default {
  data: function() {
    return {
      payees: []
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, false);
    // this.loadData()
  },
  mounted() {
    // read the current payee?
    // just list existing payees?
  },

  methods: {
    loadData() {
      // get the payees
      appService.db.payees.toArray().then(payees => (this.payees = payees));
    },
    onCreateClicked() {
      console.log("create new");
    },
    onDeleteAllClicked() {
      console.log("delete all clicked");
    },
    onMenuClicked() {
      let visible = this.$store.state.drawerOpen;
      this.$store.commit(TOGGLE_DRAWER, !visible);
    }
  },

  components: {
    PayeesToolbar
  }
};
</script>
