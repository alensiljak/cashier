<template>
  <div>
    <ActionBar/>

    <div class="container-fluid">
      <h1>Data test</h1>

      <p>
        Existing data:
        <span>{{ existingData }}</span>
      </p>
      <div>
        <textarea v-model="dummy"></textarea>
        <button type="button" class="btn btn-secondary" v-on:click="saveData">Save some data</button>
      </div>
    </div>
  </div>
</template>
<script>
import ActionBar from '../components/ActionBar.vue';
import localforage from 'localforage';

export default {
  data: function() {
    return {
      something: "nothing",
      dummy: null,
      existingData: null
    };
  },
  created() {
    this.dummy = "Some dummy text";

    // load data from storage
    localforage.getItem("key").then(value => {
        if (value == null) {
            value = "<no data found>"
        }
      this.existingData = value;
    });
  },
  methods: {
    saveData() {
      // console.log("saving", this.dummy);
      localforage.setItem("key", this.dummy).then(this.doSomethingElse);
    },
    doSomethingElse() {
      console.log("should have saved:", this.dummy);
    }
  },
  components: {
    ActionBar
  }
};
</script>
