/*
    Data Access Layer implemented with Dexie.js
*/
import Dexie from 'dexie';
import { Account, Transaction, Posting } from './model';

// Define the schema

const db = new Dexie('Cashier');

db.version(0.1).stores({
    // transactions: "++id, date, payee, postings"
    transactions: "++id, date",
    postings: "++id, transactionId, account",
    accounts: "++id, name"
    // todo commodities
    // todo payees
});

db.postings.mapToClass(Account)
// todo commodities
// todo payees
db.postings.mapToClass(Posting)
db.transactions.mapToClass(Transaction)

export default db