/*
    Vuex store.

    Below is a simple store pattern to manage the state / domain model.
    Currently not in use but demonstrates how to use shared state.
    Simplified version that avoids the complexity of Vuex.
    
    https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
*/
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

import Posting from "./components/Posting.js"
import { ADD_POSTING, CLEAR_POSTINGS, DELETE_POSTING, SET_PAYEE } from './mutations'

// Make sure to call Vue.use(Vuex) first if using a module system

export const store = new Vuex.Store({
    state: {
        count: 0,
        transactions: [],
        transaction: {
            date: null,
            payee: "",
            postings: []
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        [ADD_POSTING] (state) {
            // delete one of the postings in the New Transaction
            state.transaction.postings.push(new Posting())
        },
        [DELETE_POSTING] (state, index) {
            // delete one of the postings in the New Transaction
            state.transaction.postings.splice(index, 1)
        },
        [CLEAR_POSTINGS] (state) {
            state.transaction.postings = []
        },
        [SET_PAYEE] (state, payee) {
            state.transaction.payee = payee
        }
    },
    actions: {
        addDefaultNewPostings(context) {
            context.commit(ADD_POSTING)
            context.commit(ADD_POSTING)
        },
        addPosting(context) {
            // delete one of the postings in the New Transaction
            context.commit(ADD_POSTING)
        },
        clearPostings(context) {
            context.commit(CLEAR_POSTINGS)
        },
        deletePosting(context, index) {
            // delete one of the postings in the New Transaction
            context.commit(DELETE_POSTING, index)
        },
        setPayee(context, payee) {
            context.commit(SET_PAYEE, payee)
        }
    },
    getters: {
        transaction: state => state.transaction,
        transactions: state => state.transactions
    }
})


var simple_store = {
    debug: true,
    state: {
        message: 'Hello!',
        transactions: [],
        transaction: {
            postings: []
        }
    },
    init() {
        // todo: create the two initial postings by default
        // var p1 = new Posting()
        // this.state.transaction.postings.append(p1)
    },
    addNewPosting() {
        // delete one of the postings in the New Transaction
        this.state.transaction.postings.append(new Posting())
    },
    deleteNewPosting(index) {
        // delete one of the postings in the New Transaction
        this.state.transaction.postings.splice(index, 1)
    },
    setMessageAction(newValue) {
        if (this.debug) console.log('setMessageAction triggered with', newValue)
        this.state.message = newValue
    },
    clearMessageAction() {
        if (this.debug) console.log('clearMessageAction triggered')
        this.state.message = ''
    }
}

//export default store
