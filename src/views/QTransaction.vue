<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <q-scroll-area style="height: 100%;">
      <!-- Transaction -->

      <!-- date control -->
      <q-dialog ref="qDateProxy" v-model="datePickerVisible">
        <q-date
          ref="datePicker"
          dark
          v-model="isoDate"
          first-day-of-week="1"
          today-btn
          @input="onDateSelected"
          mask="YYYY-MM-DD"
        />
        <!-- value="isoDate" -->
      </q-dialog>

      <q-input label="Date" v-model="isoDate" dark @click="datePickerVisible = true">
        <template v-slot:prepend>
          <q-icon name="event"/>
        </template>
      </q-input>

      <!-- payee -->

      <q-input label="Payee" dark v-model="payee">
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
        v-for="(posting, index) in postings"
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
          <q-btn
            color="secondary"
            text-color="accent"
            label="Clear"
            size="medium"
            @click="onClear"
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
    </q-scroll-area>
  </q-page>
</template>

<script>
import QPosting from "../components/QPosting.vue";
import {
  ADD_POSTING,
  // eslint-disable-next-line
  CLEAR_POSTINGS,
  DELETE_POSTING,
  SET_PAYEE,
  SET_TX_DATE,
  SET_TITLE
} from "../mutations";
import { RESET_TRANSACTION } from "../actions";
// import { date } from "quasar"
import db from "../dataStore";
import { Transaction, Posting } from "../model";

export default {
  data: function() {
    return {
      // date: new Date().toISOString().substring(0, 10),
      datePickerVisible: false
    };
  },
  created() {
    // get the data
    // Add the two initial postings
    // this.$store.dispatch(RESET_TRANSACTION);
    // this.$store.dispatch(SET_TITLE, "New Transaction");
    this.$store.commit(SET_TITLE, "New Transaction");
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    //this.$refs.date
    // this.date = new Date().toISOString().substring(0, 10);
  },
  components: {
    QPosting
  },
  methods: {
    addPosting: function() {
      this.$store.dispatch(ADD_POSTING);
    },
    deletePosting: function(index) {
      this.$store.dispatch(DELETE_POSTING, index);
    },
    onClear() {
      // Resets all Transaction fields to defaults.
      this.$store.dispatch(RESET_TRANSACTION);
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
      console.log("save clicked");
      // store the transaction
      let model = this.$store.state.transaction;
      let tx = new Transaction();
      tx.id = new Date().getTime();
      // mapping
      tx.date = model.date;
      tx.payee = model.payee;

      let postings = [];
      this.postings.forEach(postingModel => {
        let posting = new Posting();
        posting.transactionId = tx.id;
        posting.account = postingModel.account;
        posting.amount = postingModel.amount;
        posting.currency = postingModel.currency;

        postings.push(posting);
      });

      // use transaction
      db.transaction("rw", db.transactions, db.postings, () => {
        // save all items together.
        db.transactions.add(tx);

        postings.forEach(posting => {
          db.postings.add(posting);
        });
      })
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
  computed: {
    postings: {
      get: function() {
        return this.$store.state.transaction.postings;
      }
    },
    payee: {
      get: function() {
        return this.$store.state.transaction.payee;
      },
      set: function(value) {
        this.$store.dispatch(SET_PAYEE, value);
      }
    },
    isoDate: {
      get() {
        return this.$store.state.transaction.date;
      },
      set(value) {
        // console.log(value)
        this.$store.dispatch(SET_TX_DATE, value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/styles.scss";
</style>
