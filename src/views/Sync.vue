<template>
  <q-page padding class="bg-colour-1 text-colour-2">
    <p>The synchronization is done with an instance of hledger-web.</p>

    <div>
      <q-btn @click="btnClick" label="save" color="secondary" text-color="accent" />
      <q-btn @click="onLoadClick" label="load" color="secondary" text-color="accent"/>
      <div>{{ test }}</div>
    </div>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";
import localforage from 'localforage';

export default {
  data() {
    return {
      test: 'nothing yet'
    };
  },
  created() {
    this.$store.commit(SET_TITLE, "Synchronization");
  },
  methods: {
    btnClick() {
      // save some data
      localforage.LOCALSTORAGE = "settings";
      localforage.setItem("test", "something");
    },
    onLoadClick() {
      // todo load settings
      localforage.LOCALSTORAGE = "settings";
      localforage.getItem("test").then(value => this.test = value);
    }
  }
};
</script>
