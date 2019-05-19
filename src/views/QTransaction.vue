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
      v-on:delete-row="deletePosting"
    />

    <!-- Actions -->
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

    <!-- main actions -->
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
import {
  ADD_POSTING,
  // eslint-disable-next-line
  CLEAR_POSTINGS,
  // DELETE_POSTING,
  // SET_PAYEE,
  // SET_TX_DATE,
  SET_TITLE
  // SET_TRANSACTION
} from "../mutations";
// import { RESET_TRANSACTION } from "../actions";
import appService from "../appService";

export default {
  data: function() {
    return {
      datePickerVisible: false,
      tx: null // transaction being edited
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "New Transaction");

    // get the data
    let id = this.$route.params.id;
    if (id) {
      // this.new = false;
      // load data for the transaction
      this.loadTransaction(id);
    } else {
      // new item.
      this.tx = appService.createTransaction()
    }
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    //this.$refs.date
    // this.date = new Date().toISOString().substring(0, 10);
  },

  methods: {
    addPosting: function() {
      this.$store.dispatch(ADD_POSTING);
    },
    deletePosting: function(index) {
      // this.$store.dispatch(DELETE_POSTING, index);
      console.log('request to delete posting', index)
      // todo
    },
    loadTransaction(id) {
      appService.loadTransaction(id).then(tx => {
        // console.log(tx)
        // Put into the state store.
        // this.$store.commit(SET_TRANSACTION, tx);
        this.tx = tx;
      });
    },
    onClear() {
      // Resets all Transaction fields to defaults.
      // this.$store.dispatch(RESET_TRANSACTION);
    },
    onDateClicked() {
      console.log("date clicked");
    },
    onDateFocus() {
      console.log("date got focus");
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
        .then(result => {
          // transaction committed
          console.log("saved.", result);
          // clear Transaction entry
          this.onClear();
          // go to register?
          this.$router.push({ name: "register" });
        })
        .catch(err => {
          console.error(err);
        });
    }
  },

  components: {
    QPosting
  },

  computed: {
    // postings: {
    //   get: function() {
    //     return this.$store.state.transaction.postings;
    //   }
    // },
    // payee: {
    //   get: function() {
    //     return this.$store.state.transaction.payee;
    //   },
    //   set: function(value) {
    //     this.$store.dispatch(SET_PAYEE, value);
    //   }
    // },
    // isoDate: {
    //   get() {
    //     return this.$store.state.transaction.date;
    //   },
    //   set(value) {
    //     // console.log(value)
    //     this.$store.dispatch(SET_TX_DATE, value);
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/styles.scss";
</style>
