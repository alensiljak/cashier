/*
    Vuex application state store.

    store.dispatch() => invokes action
    store.commit() => invokes mutation
*/
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

import { ADD_POSTING, CLEAR_POSTINGS, DELETE_POSTING, SET_PAYEE, SET_TITLE,
    SET_TX_DATE, TOGGLE_DRAWER, MAIN_TOOLBAR } from './mutations'
import { RESET_TRANSACTION, SAVE_TRANSACTION } from './actions'
import { Transaction, Posting } from './model'

let newTx = new Transaction()
newTx.date = new Date().toISOString().substring(0, 10)
newTx.postings = []
newTx.postings.push(new Posting)
newTx.postings.push(new Posting)

// const store =
export default new Vuex.Store({
    //strict: true,
    state: {
        mainToolbarVisible: true,
        pageTitle: 'Cashier', // the title in the toolbar
        activeAccount: null,
        drawerOpen: null,
        // unused?
        dateFormatIso: "yyyy-MM-dd",
        // dateFormatLong: "dd MMMM yyyy",
    },
    // Data transformations
    mutations: {
        // increment(state) {
        //     state.count++
        // },
        // [ADD_POSTING] (state) {
        //     // delete one of the postings in the New Transaction
        //     state.transaction.postings.push(new Posting())
        // },
        // [DELETE_POSTING] (state, index) {
        //     // delete one of the postings in the New Transaction
        //     state.transaction.postings.splice(index, 1)
        // },
        // [CLEAR_POSTINGS] (state) {
        //     state.transaction.postings = []
        // },
        [MAIN_TOOLBAR] (state, visible) {
            state.mainToolbarVisible = visible
        },
        // [SET_PAYEE] (state, payee) {
        //     state.transaction.payee = payee
        // },
        // [SET_PAYEES] (state, payeesArray) {
        //     state.payees = payeesArray
        // },
        // [SET_TX_DATE] (state, date) {
        //     state.transaction.date = date
        // },
        [SET_TITLE] (state, title) {
            state.pageTitle = title
        },
        // [SET_TRANSACTION] (state, transaction) {
        //     // context.commit(SET_TRANSACTION, transaction)
        //     state.transaction = transaction
        // },
        [TOGGLE_DRAWER] (state, drawerVisible) {
            state.drawerOpen = drawerVisible
        }
    },

    // Business logic.
    actions: {
        [ADD_POSTING] (context) {
            context.commit(ADD_POSTING)
        },
        [CLEAR_POSTINGS] (context) {
            context.commit(CLEAR_POSTINGS)
        },
        [DELETE_POSTING] (context, index) {
            // delete one of the postings in the New Transaction
            context.commit(DELETE_POSTING, index)
        },
        [SET_PAYEE] (context, payee) {
            context.commit(SET_PAYEE, payee)
        },
        [SET_TX_DATE] (context, date) {
            context.commit(SET_TX_DATE, date)
        },
        [RESET_TRANSACTION] (context) {
            context.commit(CLEAR_POSTINGS)
            // add the default postings
            context.commit(ADD_POSTING)
            context.commit(ADD_POSTING)

            context.commit(SET_PAYEE, '')

            // set today as a default
            var today = new Date().toISOString().substring(0, 10);
            context.commit(SET_TX_DATE, today)
        },
        /**
         * Saves the edited transaction to the store.
         * @param {context} context 
         */
        [SAVE_TRANSACTION] (context) {
            // todo: store the transaction into the list
            var tx = context.state.transaction
            //context.commit(SAVE_TRANSACTION)
            console.log(tx)
        }
    },
    getters: {
        // transaction: state => state.transaction,
        transactions: state => state.transactions
    }
})
