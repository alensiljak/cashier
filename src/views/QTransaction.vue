<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <!-- Transaction -->
    <div class="row">
      <div class="col-xs-12 col-sm-4">
        <!-- label for date -->
        <q-field dark outlined label="Outlined" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">Field content {{ date }}</div>
          </template>
        </q-field>
      </div>

      <!-- date control -->
      <div class="col-xs-12 col-sm-8">
        <q-input dark filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy">
                <q-date
                  ref="datePicker"
                  dark
                  v-model="date"
                  first-day-of-week="1"
                  today-btn
                  @input="onDateSelected"
                  mask="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <div class="col">
      <div class="form-group">
        <label for="payee">Payee</label>
        <input ref="payee" type="text" class="form-control" placeholder="Payee" v-model="payee">
        <!-- autofocus -->
      </div>
    </div>

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
    <div class="row mt-3">
      <div class="col">
        <q-btn color="secondary" text-color="accent" label="Add Posting" v-on:click="addPosting"/>
      </div>

      <div class="col text-right">
        <q-btn color="secondary" text-color="accent" label="Clear" v-on:click="onClear"/>
        <q-btn color="accent" text-color="secondary" label="Save" v-on:click="onSave"/>
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
  DELETE_POSTING,
  SET_PAYEE,
  SET_TX_DATE,
  SET_TITLE
} from "../mutations";
import { RESET_TRANSACTION, SAVE_TRANSACTION } from "../actions"
// import { date } from "quasar"

export default {
  created() {
    // get the data
    // Add the two initial postings
    this.$store.dispatch(RESET_TRANSACTION);
    // this.$store.dispatch(SET_TITLE, "New Transaction");
    this.$store.commit(SET_TITLE, "New Transaction");
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    //this.$refs.date
  },
  data: function() {
    return {
      date: null
    };
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
    onDateSelected(value, reason, details) {
      if (reason !== "day" && reason !== "today") return;
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide()

      // save the date?
      this.$store.dispatch(SET_TX_DATE, value)
    },
    onSave() {
      console.log("save clicked");
      // store the transaction
      this.$store.dispatch(SAVE_TRANSACTION)
    }
  },
  computed: {
    postings: {
      get: function() {
        return this.$store.state.transaction.postings
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
    // date: {
    //   get: function() {
    //     return this.$store.state.transaction.date;
    //   },
    //   set: function(value) {
    //     this.$store.dispatch(SET_TX_DATE, value);
    //   }
    // }
    // dateFormat() {
    //   //return this.$store.state.dateFormatLong
    //   return "D, " + this.$store.state.dateFormatLong;
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/styles.scss";
</style>
