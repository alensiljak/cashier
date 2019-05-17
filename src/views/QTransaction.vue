<template>
  <div>
    <form>
      <!-- Transaction -->
      <div class="form-row">
        <div class="col-md-2">
          <div class="form-group">
            <label for="date">Date</label>
            <!-- <input ref="date" class="form-control" v-model="date"> -->
            <Datepicker
              input-class="form-control"
              v-model="date"
              :monday-first="true"
              :bootstrap-styling="true"
              :format="dateFormat"
              calendar-class="custom-calendar"
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="payee">Payee</label>
            <input ref="payee" type="text" class="form-control" placeholder="Payee" v-model="payee">
            <!-- autofocus -->
          </div>
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
          <button type="button" class="btn btn-secondary" v-on:click="addPosting">Add Posting</button>
        </div>

        <div class="col text-right">
          <button type="button" class="btn btn-secondary mr-1" v-on:click="onClear">Clear</button>
          <button type="button" class="btn btn-primary px-4" v-on:click="onSave">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import QPosting from "../components/QPosting.vue";
import {
  ADD_POSTING,
  // eslint-disable-next-line
  CLEAR_POSTINGS,
  DELETE_POSTING,
  SET_PAYEE,
  SET_TX_DATE
} from "../mutations";
import { RESET_TRANSACTION, SAVE_TRANSACTION } from "../actions";
import Datepicker from "vuejs-datepicker";

export default {
  created() {
    // get the data
    // Add the two initial postings
    this.$store.dispatch(RESET_TRANSACTION);
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    //this.$refs.date
  },
  data: function() {
    return {
      //date: null
    };
  },
  components: {
    QPosting,
    Datepicker
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
    onSave() {
      // store the transaction
      this.$store.dispatch(SAVE_TRANSACTION);
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
    date: {
      get: function() {
        return this.$store.state.transaction.date;
      },
      set: function(value) {
        this.$store.dispatch(SET_TX_DATE, value);
      }
    },
    dateFormat() {
      //return this.$store.state.dateFormatLong
      return "D, " + this.$store.state.dateFormatLong;
    }
  }
};
</script>
<style lang="scss">
@import "../styles/palette.scss";

// calendar component
.custom-calendar {
  background-color: $colour-5;
  color: $colour-2;

  .cell.selected {
    background-color: $colour-4;
  }
}
// calendar, today
.today {
  color: $colour-3;
}
// calendar, selected date
</style>
