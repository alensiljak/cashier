<template>
  <div>
    <ActionBar title="Cashier"/>

    <div class="container-fluid">
      <h1>Home</h1>
      <p>Some basic page, to serve as a temporary home page</p>

      <!-- <comp1></comp1> -->
    </div>
  </div>
</template>
<script>
import ActionBar from "../components/ActionBar.vue";

export default {
  created() {
    // todo: load data here
    //console.log('created', this.$store)
  },
  mounted: function() {},
  computed: {},
  components: {
    ActionBar
  }
};
</script>
