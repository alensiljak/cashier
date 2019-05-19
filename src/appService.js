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
            let txs = db.transactions.toCollection()
            // load related postings
            let posts = db.postings.toCollection()
            var result = []

            txs.each(tx => {
                posts.filter(p => p.transactionId == tx.id).each(posting => {
                    // console.log(posting)
                    tx.postings = tx.postings || []
                    tx.postings.push(posting)
                })
                result.push(tx)
            });

            // console.log("txs", txs)
            return result
        })
    }
}

export default new AppService()
