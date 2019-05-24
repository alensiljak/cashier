<template>
  <q-page padding class="bg-colour1 text-amber-2">
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
        <q-icon name="fas fa-calendar-day"/>
      </template>
    </q-input>

    <!-- payee -->

    <q-input label="Payee" dark v-model="tx.payee">
      <template v-slot:prepend>
        <q-icon name="fas fa-user"/>
      </template>
    </q-input>

    <!--comment -->
    <q-input label="Comment" dark v-model="tx.comment">
      <template v-slot:prepend>
        <q-icon name="fas fa-file-alt"/>
      </template>
    </q-input>

    <div class="form-row q-mt-sm">
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
      @accountFocus="onAccountFocus(index)"
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
import QPosting from "@/components/Posting.vue";
import { Posting } from "@/model";
import {
  MAIN_TOOLBAR,
  SET_TITLE,
  SET_TRANSACTION,
  SET_SELECT_MODE
} from "@/mutations";
import appService from "@/appService";
import { SelectionModeMetadata } from "../Configuration";

const ACCOUNT = "account";

export default {
  data: function() {
    return {
      datePickerVisible: false,
      accounts: []
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "New Transaction");
    this.$store.commit(MAIN_TOOLBAR, true);

    // get the data
    this.loadData();

    // are we back from the select mode?
    if (this.$store.state.selectModeMeta) this.handleSelection();
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    //this.$refs.date
    // this.date = new Date().toISOString().substring(0, 10);
  },

  methods: {
    addPosting() {
      // this.$store.dispatch(ADD_POSTING);
      this.tx.postings.push(new Posting());
    },
    deletePosting(index) {
      // console.log("request to delete posting", index);
      this.tx.postings.splice(index, 1);
    },
    /**
     * Handle selection after a picker returned.
     */
    handleSelection() {
      // todo handle blank id if the user presses 'back'.
      let select = this.$store.state.selectModeMeta;
      let id = select.selectedId;

      switch (select.selectionType) {
        case "payee":
          console.log("payee", id);
          break;
        case ACCOUNT:
          // get the posting
          var posting = this.tx.postings[select.postingIndex];
          appService.db.accounts.get(id).then(account => {
            posting.account = account.name;
            posting.currency = account.currency;
          });
          // console.log("account", id);
          break;
      }

      // clean-up, reset the selection values
      this.$store.commit(SET_SELECT_MODE, null);
    },
    loadAccounts() {
      // load accounts from storage.
      appService.db.accounts
        .orderBy("name")
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
      // this.loadAccounts();
    },
    loadTransaction(id) {
      appService.loadTransaction(id).then(tx => {
        this.tx = tx;
      });
    },
    onAccountFocus(index) {
      let selectMode = new SelectionModeMetadata();

      // save the index of the posting being edited
      selectMode.postingIndex = index;
      // set the type
      selectMode.selectionType = ACCOUNT;
      // set the return route
      selectMode.originRoute = { name: "tx" };

      // set the selection mode
      this.$store.commit(SET_SELECT_MODE, selectMode);
      // show account picker
      this.$router.push({ name: "accounts" });
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
      let tx = appService.createTransaction();
      this.tx = tx;
      return tx;
    }
  },

  components: {
    QPosting
  },

  computed: {
    tx: {
      get() {
        // console.log('getting tx')
        let tx = this.$store.state.transaction;
        if (tx === null) {
          tx = this.resetTransaction();
        }
        return tx;
      },
      set(value) {
        //console.log('setting tx', value)
        // todo save in the state store
        this.$store.commit(SET_TRANSACTION, value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/styles.scss";
</style>
