/*
Operations on the current transaction.
The transaction editors keep the currently-edited transaction in the store.
To avoid chaos with store operations, these are encapsulated here.
*/
import { Transaction, Posting } from '../model'

export class CurrentTransactionService {
  // constructor(store) {
  //   if (!store) {
  //     throw 'store is mandatory'
  //   }
  //   this.store = store
  // }

  createTransaction() {
    var tx = new Transaction()
    tx.date = new Date().toISOString().substring(0, 10)

    tx.postings.push(new Posting())
    tx.postings.push(new Posting())

    return tx
  }
}
