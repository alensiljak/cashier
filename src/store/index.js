/*
    Vuex application state store.

    store.dispatch() => invokes action
    store.commit() => invokes mutation
*/
import { createStore } from 'vuex'
import { isProxy, toRaw } from 'vue'

import {
  SET_SELECT_MODE,
  SET_SELECTED_ID,
  SET_PAYEE,
  SET_POSTING,
  SET_TRANSACTION,
  TOGGLE_DRAWER,
  SET_LEDGER_USE,
} from '../mutations'
import { Posting } from 'src/model'

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

//export default new Vuex.Store({
export default function (/* { ssrContext } */) {
  const Store = createStore({
    // strict: true,
    strict: process.env.DEBUGGING,
    state: {
      // for storing the transactions being edited or anything else, temporarily.
      clipboard: null,
      drawerOpen: null,
      transaction: null, // The transaction being edited.
      // Select mode: set select mode, open list, select item, save id, return to the caller.
      // SelectionModeMetadata class.
      selectModeMeta: null,
      // Use Cashier Sync for providing Ledger data?
      useLedger: false,
    },
    // Data transformations
    mutations: {
      addPosting(state) {
        let tx = state.transaction
        tx.postings.push(new Posting())
      },
      /**
       * Set the metadata for the select mode.
       * @param {*} state
       * @param {SelectionModeMetadata} metadata
       */
      [SET_SELECT_MODE](state, metadata) {
        state.selectModeMeta = metadata
      },
      [SET_SELECTED_ID](state, payload) {
        let meta = state.selectModeMeta
        meta.selectedId = payload
        state.selectModeMeta = meta
      },
      [SET_TRANSACTION](state, transaction) {
        state.transaction = transaction
      },
      [SET_PAYEE](state, payload) {
        // let tx = structuredClone(state.transaction);
        let tx = toRaw(state.transaction)

        tx.payee = payload
        state.transaction = tx
      },
      [SET_POSTING](state, payload) {
        let index = payload.index
        let posting = payload.posting

        //let tx = structuredClone(state.transaction);
        //let tx = toRaw(state.transaction);
        let tx = state.transaction

        tx.postings[index] = posting

        state.transaction = tx
      },
      setPostings(state, postingsArray) {
        let tx = state.transaction
        tx.postings = postingsArray

        state.transaction = tx
      },
      [TOGGLE_DRAWER](state, drawerVisible) {
        state.drawerOpen = drawerVisible
      },
      [SET_LEDGER_USE](state, useLedger) {
        state.useLedger = useLedger
      },
      saveToClipboard(state, payload) {
        state.clipboard = payload
      },
    },

    // Business logic.
    actions: {
      addPosting(context) {
        context.commit('addPosting')
      },
      resetPostings(commit, state) {
        let tx = state.transaction
        tx.postings = []
        commit(SET_TRANSACTION, tx)
      },
      setSelectedId(context, id) {
        context.commit(SET_SELECTED_ID, id)
      },
    },
    getters: {
      liveModeOn: (state) => state.useLedger,
    },
  })

  return Store
}
