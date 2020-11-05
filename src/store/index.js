/*
    Vuex application state store.

    store.dispatch() => invokes action
    store.commit() => invokes mutation
*/
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import {
  SET_SELECT_MODE,
  SET_POSTING,
  SET_TRANSACTION,
  TOGGLE_DRAWER,
  SET_LEDGER_USE
} from "../mutations";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// export default function(/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules: {
//       // example
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: process.env.DEV
//   });

//   return Store;
// }

export default new Vuex.Store({
  // strict: true,
  state: {
    activeAccount: null,
    drawerOpen: null,
    transaction: null, // The transaction being edited.
    // Select mode: set select mode, open list, select item, save id, return to the caller.
    selectModeMeta: null,
    // unused?
    dateFormatIso: "yyyy-MM-dd",
    // Use Cashier Sync for providing Ledger data?
    useLedger: false
  },
  // Data transformations
  mutations: {
    /**
     * Set the metadata for the select mode.
     * @param {*} state
     * @param {SelectionModeMetadata} metadata
     */
    [SET_SELECT_MODE](state, metadata) {
      state.selectModeMeta = metadata;
    },
    [SET_TRANSACTION](state, transaction) {
      state.transaction = transaction;
    },
    [SET_POSTING](state, payload) {
      let index = payload.index
      let posting = payload.posting
      state.transaction.postings[index] = posting
    },
    [TOGGLE_DRAWER](state, drawerVisible) {
      state.drawerOpen = drawerVisible;
    },
    [SET_LEDGER_USE](state, useLedger) {
      state.useLedger = useLedger
    }
  },

  // Business logic.
  actions: {
  },
  getters: {
    drawerOpen: state => state.drawerOpen,
    transaction: state => state.transaction,
    liveModeOn: state => state.useLedger,
  }
});
