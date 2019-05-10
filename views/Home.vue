<template>
  <div>
    <h1>Home</h1>
    <p>Some basic page, to serve as a temporary home page</p>

    <!-- <comp1></comp1> -->
  </div>
</template>
<script>
//import Comp1 from './Component1.vue'

export default {
  created() {
    console.log(this.$store)
  },
  mounted: function() {
    // test
    console.log(this.$root.store)
    console.log(this.$root.$store)
    console.log(this.$store)
    console.log(this.store)
  },
  computed: {

  }
};
</script>
