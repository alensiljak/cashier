<template>
  <q-page padding class="text-colour2">
    <toolbar title="About">
      <q-btn flat round dense>
        <more-vertical />
        <q-menu>
          <q-list style="min-width: 175px">
            <q-item v-close-popup clickable @click="onOpfsClick">
              <q-item-section>OPFS Experiment</q-item-section>
              <q-item-section side>
                <FolderOpen />
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="onWebdavClick">
              <q-item-section>WebDAV Experiment</q-item-section>
              <q-item-section side>
                <Cloud />
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="onWasmClick">
              <q-item-section>Wasm Experiment</q-item-section>
              <q-item-section side>
                <PuzzleIcon />
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-btn>
    </toolbar>

    <div>
      <div style="width: 100%" class="text-center">
        <h3 class="q-my-sm">Cashier</h3>
        <!-- <img src="/icons/favicon-96x96.png"> -->
        <img src="/icons/favicon-96x96.png" />
      </div>
      <div class="text-center q-my-sm">by Alen Šiljak</div>
      <div>
        This software is intended to be used as a part of Plain-Text Accounting
        ecosystem. More specifically, it is a GUI helper for
      </div>
      <ul>
        <li><a href="https://ledger-cli.org">Ledger</a>, and</li>
        <li>
          <a href="https://hledger.org">Hledger</a>
        </li>
      </ul>
      <p>
        The source code is available in a
        <a href="https://github.com/alensiljak/cashier">source code repository</a>
        on GitHub. This is also the preferred way to submit feature and bugs.
      </p>

      <h4 class="q-my-sm text-center">Credits</h4>
      <ul>
        <li>
          <a href="https://www.freepik.com/free-photos-vectors/gold">
            Gold vector created by freepik - www.freepik.com</a>
        </li>
      </ul>

      <h4 class="q-my-sm text-center">Components</h4>
      <ul>
        <li>
          <a href="https://quasar.dev/">Quasar Framework</a>
        </li>
        <li>
          <a href="http://lucide.dev/">Lucide icons</a>
        </li>
        <li>
          <a href="https://vuejs.org/">Vue JS, Vuex</a>
        </li>
        <li>
          <a href="https://dexie.org/">Dexie.js</a>
        </li>
        <li>
          <a href="https://github.com/Akryum/vue-virtual-scroller">
            Vue Virtual Scroller
          </a>
        </li>
        <li>
          <a href="https://numeraljs.com/">Numeral JS</a>
        </li>
        <li>
          <a href="https://github.com/SortableJS/vue.draggable.next">
            Vue Draggable Next
          </a>
        </li>
        <li>
          <a href="https://github.com/sergirams/neu-calculator">Neu Calculator</a>
        </li>
      </ul>

      <h4 class="q-my-sm text-center">Resources</h4>
      <ul>
        <li>
          Try your output journal with
          <a href="https://hledger.alhur.es/">hledger interactive</a>.
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Toolbar from '../components/CashierToolbar.vue'
import { Cloud, FolderOpen, MoreVertical, PuzzleIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const $router = useRouter()

function onOpfsClick() {
  $router.push('/opfs')
}

async function onWasmClick() {
  $router.push('ledger-wasm')
}

async function onWebdavClick() {
  $router.push('webdav')
}

</script>

<style lang="scss" scoped>
a {
  color: aqua;
}
</style>
