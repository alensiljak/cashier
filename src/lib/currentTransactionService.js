/*
Operations on the current transaction.
The transaction editors keep the currently-edited transaction in the store.
To avoid chaos with store operations, these are encapsulated here.
*/

export class CurrentTransactionService {
    constructor() {

    }

    /**
     * Retrieve the full transaction.
     */
    getTx() {

    }
    /**
     * Save the transaction into the state store.
     * @param {Transaction} tx 
     */
    setTx(tx) {

    }

    createTransaction() {
        var tx = new Transaction()
        tx.date = new Date().toISOString().substring(0, 10)
    
        tx.postings.push(new Posting())
        tx.postings.push(new Posting())
    
        return tx
      }
    
}