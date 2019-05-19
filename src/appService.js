/*
    Provide service layer for the application.
*/
import db from "./dataStore"
import { Transaction, Posting } from './model'
// import { Notify } from 'quasar'

class AppService {
    createTransaction() {
        var tx = new Transaction();
        tx.date = new Date().toISOString().substring(0, 10)
      
        tx.postings.push(new Posting())
        tx.postings.push(new Posting())
  
        return tx
    }

    /**
     * Delete transaction and related postings.
     * @param {*} id
     */
    deleteTransaction(id) {
        return db.transaction("rw", db.transactions, db.postings, () => {
            // delete transaction record
            db.transactions.filter(tx => tx.id == id).delete()

            // delete postings
            db.postings.filter(value => value.transactionId == id).delete()
        });
    }

    /**
     * Load all transactions with postings.
     * Sort by date.
     */
    loadTransactions() {
        return db.transaction('r', db.transactions, db.postings, () => {
            // load all transactions
            // let x = db.transactions.toCollection().sortBy('date') = array
            // let x = db.transactions.orderBy('date') = collection
            return db.transactions.orderBy('date').reverse().toArray().then(array => {
                array.forEach(tx => {
                    // load related postings
                    db.postings.filter(p => p.transactionId == tx.id).toArray()
                        .then(array => {
                            array.forEach(posting => {
                                tx.postings = tx.postings || []
                                tx.postings.push(posting)

                                // return tx
                            })
                            return array
                        })
                    // console.log('6th level')
                })
                return array
            })
        })
    }

    /**
     * Load single transaction with postings.
     * @param {int} id Transaction id
     * @returns Transaction with Postings
     */
    loadTransaction(id) {
        return db.transaction('r', db.transactions, db.postings, () => {
            return db.transactions.get(id).then(tx => {
                // todo load postings
                return db.postings.where({ transactionId: tx.id }).toArray().then(postings => {
                    // console.log('posting', postings)
                    tx.postings = postings
                    return tx
                })

                // return tx
            })
        })
    }

    /**
     * Save the transaction to the database.
     * @param {Transaction} tx The transaction object
     */
    saveTransaction(tx) {
        if (tx.id === null) {
            // create a new id for the transaction
            tx.id = new Date().getTime();
            // set transaction id on postings
            for (let i = 0; i < tx.postings.length; i++) {
                tx.postings[i].transactionId = tx.id
            }
            // tx.postings.forEach(p => p.transactionId == tx.id)
        }

        // save all items in a transaction
        return db.transaction("rw", db.transactions, db.postings, () => {
            db.postings.bulkPut(tx.postings)
            // tx.postings.forEach(posting => {
            //     db.postings.put(posting)
            // })

            db.transactions.put(tx)
        })
    }
}

export default new AppService()
