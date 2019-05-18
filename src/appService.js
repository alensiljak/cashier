/*
    Provide service layer for the application.
*/
import db from "./dataStore";
// import { Notify } from 'quasar'

class AppService {
  deleteTransaction(id) {
    return db.transaction("rw", db.transactions, db.postings, () => {
      // delete transaction record
      db.transactions.filter(tx => tx.id == id).delete();
      // delete postings
      db.postings.filter(value => value.transactionId == id).delete();
    });
  }
}

export default new AppService();
