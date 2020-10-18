<template>
  <div>
    <ActionBar title="Transaction" />

    <div class="container-fluid">
      <form>
        <!-- Transaction -->
        <div class="form-row">
          <div class="col-md-2">
            <div class="form-group">
              <label for="date">Date</label>
              <!-- <input ref="date" class="form-control" v-model="date"> -->
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="payee">Payee</label>
              <input
                ref="payee"
                v-model="payee"
                type="text"
                class="form-control"
                placeholder="Payee"
              >
              <!-- autofocus -->
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="col">Postings</div>
        </div>

        <!-- Postings -->
        <posting-view
          v-for="(posting, index) in postings"
          :key="index"
          :posting="posting"
          :index="index"
          @delete-row="deletePosting"
        />

        <!-- Actions -->
        <div class="row mt-3">
          <div class="col">
            <button type="button" class="btn btn-secondary" @click="addPosting">Add Posting</button>
          </div>

          <div class="col text-right">
            <button type="button" class="btn btn-secondary mr-1" @click="onClear">Clear</button>
            <button type="button" class="btn btn-primary px-4" @click="onSave">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import ActionBar from "../components/ActionBar.vue";
import PostingView from "../components/Posting.vue";
import {
  ADD_POSTING,
  // eslint-disable-next-line
  CLEAR_POSTINGS,
  DELETE_POSTING,
  SET_PAYEE,
  SET_TX_DATE
} from "../mutations";
import { RESET_TRANSACTION, SAVE_TRANSACTION } from "../actions";

export default {
  components: {
    PostingView,
    ActionBar
  },
  data: function() {
    return {
      // date: null
    };
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
      // return this.$store.state.dateFormatLong
      return "D, " + this.$store.state.dateFormatLong;
    }
  },
  created() {
    // get the data
    // Add the two initial postings
    this.$store.dispatch(RESET_TRANSACTION);
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus() => this.$refs.payee
    // this.$refs.date
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
  }
};
</script>
<style lang="scss">
@import "../css/palette.scss";

// calendar component
.custom-calendar {
  background-color: $colour5;
  color: $colour2;

  .cell.selected {
    background-color: $colour4;
  }
}
// calendar, today
.today {
  color: $colour3;
}
// calendar, selected date
</style>
