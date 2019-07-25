<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div style="width:100%;" class="text-center">
      <h3 class="q-my-sm">Cashier <span style="font-size: 0.8rem">{{this.$version}}</span></h3>
      <!-- <img src="/img/icons/icon96.png"> -->
      <img src="../../public/img/icons/icon96.png">
    </div>
    <div class="text-center q-my-sm">by Alen Šiljak</div>
    <div>
      This software is intended to be used as a part of Plain-Text Accounting ecosystem.
      More specifically, it is a GUI helper for
    </div>
    <ul>
      <li>
        <a href="https://ledger-cli.org">Ledger</a>, and
      </li>
      <li>
        <a href="https://hledger.org">Hledger</a>
      </li>
    </ul>
    <p>
      The source code is available in a
      <a
        href="https://gitlab.com/alensiljak/cashier"
      >source code repository</a> on GitLab.
    </p>
    <p>The synchronization can be done with 
      <a href="https://gitlab.com/alensiljak/cashier-sync">CashierSync</a> Python component.
    </p>

    <h4 class="q-my-sm text-center">Credits</h4>
    <ul>
      <li>
        <a
          href="https://www.freepik.com/free-photos-vectors/sale"
        >Sale vector created by macrovector - www.freepik.com</a>
      </li>
      <li>
        <a
          href="https://www.freepik.com/free-photos-vectors/gold"
        >Gold vector created by freepik - www.freepik.com</a>
      </li>
    </ul>

    <h4 class="q-my-sm text-center">Components</h4>
    <ul>
      <li>
        <a href="https://v1.quasar-framework.org/">Quasar Framework</a>
      </li>
      <li>
        <a href="https://material.io/tools/icons">Material Design Icons</a>
      </li>
      <li>
        <a href="http://fontawesome.com/">Font Awesome icons</a>
      </li>
      <li>
        <a href="https://vuejs.org/">Vue JS, Vuex, Vue-cli</a>
      </li>
      <li>
        <a href="https://dexie.org/">Dexie.js</a>
      </li>
      <li>
        <a href="https://github.com/Akryum/vue-virtual-scroller">Vue Virtual Scroller</a>
      </li>
      <li>
        <a href="https://numeraljs.com/">Numeral JS</a>
      </li>
      <li>
        <a href="https://github.com/Jexordexan/vue-slicksort">Vue Slicksort</a>
      </li>
    </ul>

    <h4 class="q-my-sm text-center">Resources</h4>
    <ul>
      <li>
        Try your output journal with
        <a href="https://hledger.alhur.es/">hledger interactive</a>.
      </li>
    </ul>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "About");
    this.$store.commit(MAIN_TOOLBAR, true);
  },

  components: {}
};
</script>

<style lang="scss" scoped>
a {
  color: aqua;
}
</style>
