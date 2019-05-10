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


// Make sure to call Vue.use(Vuex) first if using a module system

const store = new Vuex.Store({
    state: {
        count: 0,
        transactions: [],
        newTransaction: {
            postings: []
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        addNewPosting() {
            // delete one of the postings in the New Transaction
            this.state.newTransaction.postings.append(new Posting())
        },
        deleteNewPosting(index) {
            // delete one of the postings in the New Transaction
            this.state.newTransaction.postings.splice(index, 1)
        },
    },
    getters: {
        newTransaction: state => state.newTransaction,
        transactions: state => state.transactions
    }
})


var simple_store = {
    debug: true,
    state: {
        message: 'Hello!',
        transactions: [],
        newTransaction: {
            postings: []
        }
    },
    init() {
        // todo: create the two initial postings by default
        // var p1 = new Posting()
        // this.state.newTransaction.postings.append(p1)
    },
    addNewPosting() {
        // delete one of the postings in the New Transaction
        this.state.newTransaction.postings.append(new Posting())
    },
    deleteNewPosting(index) {
        // delete one of the postings in the New Transaction
        this.state.newTransaction.postings.splice(index, 1)
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

export default store
