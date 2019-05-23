/*
    Data Access Layer implemented with Dexie.js
*/
import Dexie from 'dexie';
import { Account, Transaction, Payee, Posting } from './model';

// Define the schema

const db = new Dexie('Cashier');

db.version(0.1).stores({
    // transactions: "++id, date, payee, postings"
    transactions: "++id, date",
    postings: "++id, transactionId, account",
    accounts: "++id, name",
    // todo commodities
    payees: "++id, name"
});

db.postings.mapToClass(Account)
// todo commodities
db.payees.mapToClass(Payee)
db.postings.mapToClass(Posting)
db.transactions.mapToClass(Transaction)

export default db