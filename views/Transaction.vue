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
          <div class="form-group">
            <label for="payee">Payee</label>
            <input id="payee" type="text" class="form-control" v-model="payee" autofocus >
          </div>
        </div>
      </div>

      <!-- Postings -->
      <posting-view v-for="(posting, index) in postings" 
        :key="index" :posting="posting" :index="index"
        v-on:delete-row="deletePosting"></posting-view>
      <!-- :account.sync="posting.account" :amount=posting.amount :currency=posting.currency -->

      <!-- buttons -->
      <div class="row mt-3">
        <div class="col">
          <button type="button" class="btn btn-secondary" v-on:click="addPosting">Add Posting</button>
        </div>

        <div class="col text-right">
          <button type="button" class="btn btn-secondary">Clear</button>
          <button type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import Vue from "vue";
import PostingView from "../components/Posting.vue";
import Posting from "../components/Posting.js";

export default {
  mounted: function() {
    // set today as a default
    var today = new Date();
    this.date = today.toISOString().substring(0, 10);

    // Add the two initial postings
    this.postings = [new Posting(), new Posting()];

    // Set the focus on Payee field.
     document.getElementById("payee").focus();
  },
  data: function() {
    return {
      date: null,
      payee: null,
      postings: []
    };
  },
  components: {
    PostingView
  },
  methods: {
    addPosting: function() {
      this.postings.push(new Posting());
    },
    deletePosting: function(index) {
      this.postings.splice(index, 1)
    }
  }
};
</script>
