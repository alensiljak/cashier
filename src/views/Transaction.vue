<template>
  <div>
    <h1>Transaction</h1>
    <form>
      <!-- Transaction -->
      <div class="form-row">
        <div class="col-2">
          <div class="form-group">
            <label for="date">Date</label>
            <input id="date" type="date" class="form-control" v-model="date">
          </div>
        </div>
        <div class="col">
          <!-- <p v-if='this.$store.state.transaction.payee'>
            {{ this.$store.state.transaction.payee }}
          </p>-->
          <div class="form-group">
            <label for="payee">Payee</label>
            <!-- <input id="payee" type="text" class="form-control" v-model="payee" autofocus
            disabled="disabled">-->
            <router-link to="/payee" class="form-control">{{ payee }}</router-link>
          </div>
        </div>
      </div>

      <!-- Postings -->
      <posting-view
        v-for="(posting, index) in postings"
        :key="index"
        :posting="posting"
        :index="index"
        v-on:delete-row="deletePosting"
      ></posting-view>

      <!-- buttons -->
      <div class="row mt-3">
        <div class="col">
          <button type="button" class="btn btn-secondary" v-on:click="addPosting">Add Posting</button>
        </div>

        <div class="col text-right">
          <button type="button" class="btn btn-secondary" v-on:click="onClear">Clear</button>
          <button type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import PostingView from "../components/Posting.vue";
import {
  ADD_POSTING,
  CLEAR_POSTINGS,
  DELETE_POSTING,
  SET_PAYEE,
  SET_TX_DATE
} from "../mutations";
import { RESET_TRANSACTION } from "../actions";

export default {
  created() {
    // get the data
    // Add the two initial postings
    this.$store.dispatch(RESET_TRANSACTION);
  },
  mounted: function() {
    // Set the focus on Payee field.
    // document.getElementById("payee").focus();

    // test
    this.$router.push({
      //name: "payee",
      params: {
        name: "hello there" // or anything you want
      }
    });
  },
  data: function() {
    return {
      //date: null
    };
  },
  components: {
    PostingView
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
        return this.$store.state.transaction.payee
          ? this.$store.state.transaction.payee
          : "select payee";
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
    }
  }
};
</script>
