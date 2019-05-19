/*
    Provide service layer for the application.
*/
import db from "./dataStore"
// import { Notify } from 'quasar'

class AppService {
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
     * Load all transactions with postings
     */
    loadTransactions() {
        return db.transaction('r', db.transactions, db.postings, () => {
            // load all transactions
            return db.transactions.toArray().then(array => {
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
}

export default new AppService()
