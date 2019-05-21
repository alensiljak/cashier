<template>
  <q-page padding class="bg-colour1 text-colour2">
    <!-- Transaction -->

    <!-- date control -->
    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-date
        ref="datePicker"
        dark
        v-model="tx.date"
        first-day-of-week="1"
        today-btn
        @input="onDateSelected"
        mask="YYYY-MM-DD"
      />
    </q-dialog>

    <q-input label="Date" v-model="tx.date" dark @click="datePickerVisible = true">
      <template v-slot:prepend>
        <q-icon name="event"/>
      </template>
    </q-input>

    <!-- payee -->

    <q-input label="Payee" dark v-model="tx.payee">
      <template v-slot:prepend>
        <q-icon name="person"/>
      </template>
    </q-input>

    <div class="q-mb-sm"></div>

    <div class="form-row">
      <div class="col">Postings</div>
    </div>

    <!-- Postings -->
    <QPosting
      v-for="(posting, index) in tx.postings"
      :key="index"
      :posting="posting"
      :index="index"
      :accounts="accounts"
      v-on:delete-row="deletePosting"
    />

    <!-- posting actions -->
    <div class="row q-mt-sm">
      <div class="col text-center">
        <q-btn
          color="secondary"
          text-color="accent"
          label="Add Posting"
          size="small"
          @click="addPosting"
        />
      </div>
    </div>

    <!-- main Actions -->
    <div class="row q-mt-xl justify-end">
      <div class="col text-center">
        <q-btn color="secondary" text-color="accent" label="Reset" size="medium" @click="onClear"/>
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

<script>
import QPosting from "../components/QPosting.vue";
import { Posting } from "../model";
import { MAIN_TOOLBAR, SET_TITLE, SET_TRANSACTION } from "../mutations";
import appService from "../appService";

export default {
  data: function() {
    return {
      datePickerVisible: false,
      //tx: {}, // transaction being edited
      accounts: []
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "New Transaction");
    this.$store.commit(MAIN_TOOLBAR, true);

    // get the data
    this.loadData();
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    //this.$refs.date
    // this.date = new Date().toISOString().substring(0, 10);
  },

  methods: {
    addPosting: function() {
      // this.$store.dispatch(ADD_POSTING);
      this.tx.postings.push(new Posting());
    },
    deletePosting: function(index) {
      // console.log("request to delete posting", index);
      this.tx.postings.splice(index, 1);
    },
    loadAccounts() {
      // load accounts from storage.
      appService.db.accounts
        .orderBy('name')
        // .toCollection()
        // .primaryKeys()
        .uniqueKeys()
        .then(accountNames => (this.accounts = accountNames));
    },
    /**
     * Load all data for the view.
     */
    loadData() {
      // Transaction
      let id = this.$route.params.id;
      if (id) {
        this.loadTransaction(id);
      } else {
        // new item.
        // this.resetTransaction();
        // just use the item from the store
      }
      // Accounts
      this.loadAccounts();
    },
    loadTransaction(id) {
      appService.loadTransaction(id).then(tx => {
        this.tx = tx;
      });
    },
    onClear() {
      // Resets all Transaction fields to defaults.
      this.resetTransaction();
    },
    /**
     * (value, reason, details)
     */
    onDateSelected(value, reason) {
      if (reason !== "day" && reason !== "today") return;
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide();
      // the date is saved on close.
    },
    onSave() {
      // console.log("save clicked");
      // store the transaction
      // let model = this.$store.state.transaction;

      appService
        .saveTransaction(this.tx)
        .then(() => {
          // transaction committed
          // console.log("saved.", id);
          // clear Transaction entry
          this.onClear();
          // go to register?
          this.$router.push({ name: "register" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    resetTransaction() {
      let tx = appService.createTransaction()
      this.tx = tx
      return tx
    }
  },

  components: {
    QPosting
  },

  computed: {
    tx: {
      get() {
        // console.log('getting tx')
        let tx = this.$store.state.transaction
        if (tx === null) {
          tx = this.resetTransaction()
        }
        return tx
      },
      set(value) {
        //console.log('setting tx', value)
        // todo save in the state store
        this.$store.commit(SET_TRANSACTION, value)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/styles.scss";
</style>
