<template>
  <q-page class="q-pa-sm bg-colour-1 text-colour-2">
      <div style="width:100%;" class="text-center">
        <h3>About Cashier</h3>
        <img src="/img/icons/icon96.png">
      </div>
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

      <h4>Credits</h4>
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

      <h4>Components</h4>
      <ul>
        <li>
          <a href="https://v1.quasar-framework.org/">Quasar Framework</a>
        </li>
        <li>
          <a href="https://material.io/tools/icons">Material Design Icons</a>
        </li>
        <li>
          <a href="https://vuejs.org/">Vue JS, Vuex, Vue-cli</a>
        </li>
      </ul>
  </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "About");
  },
  components: {
  }
};
</script>
