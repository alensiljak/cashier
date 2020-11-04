/*
    Vuex application state store.

    store.dispatch() => invokes action
    store.commit() => invokes mutation
*/
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import {
  ADD_POSTING,
  CLEAR_POSTINGS,
  DELETE_POSTING,
  SET_SELECT_MODE,
  SET_PAYEE,
  SET_TRANSACTION,
  SET_TX_DATE,
  TOGGLE_DRAWER,
  SET_LEDGER_USE
} from "../mutations";
import { RESET_TRANSACTION } from "../actions";

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
    [TOGGLE_DRAWER](state, drawerVisible) {
      state.drawerOpen = drawerVisible;
    },
    [SET_LEDGER_USE](state, useLedger) {
      state.useLedger = useLedger
    }
  },

  // Business logic.
  actions: {
    [ADD_POSTING](context) {
      context.commit(ADD_POSTING);
    },
    [CLEAR_POSTINGS](context) {
      context.commit(CLEAR_POSTINGS);
    },
    [DELETE_POSTING](context, index) {
      // delete one of the postings in the New Transaction
      context.commit(DELETE_POSTING, index);
    },
    [SET_PAYEE](context, payee) {
      context.commit(SET_PAYEE, payee);
    },
    [SET_TX_DATE](context, date) {
      context.commit(SET_TX_DATE, date);
    },
    [RESET_TRANSACTION](context) {
      context.commit(CLEAR_POSTINGS);
      // add the default postings
      context.commit(ADD_POSTING);
      context.commit(ADD_POSTING);

      context.commit(SET_PAYEE, "");

      // set today as a default
      var today = new Date().toISOString().substring(0, 10);
      context.commit(SET_TX_DATE, today);
    }
  },
  getters: {
    // transaction: state => state.transaction,
    // transactions: state => state.transactions
  }
});
