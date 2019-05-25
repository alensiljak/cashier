/*
    Data Access Layer implemented with Dexie.js

    Useful links
    - https://dexie.org/docs/Tutorial/Design#database-versioning
*/
import Dexie from 'dexie';
import { Account, Transaction, Payee, Posting, Setting } from '@/model';

// Define the schema

const db = new Dexie('Cashier');

// Schema

db.version(0.1).stores({
    // transactions: "++id, date, payee, postings"
    transactions: "++id, date",
    postings: "++id, transactionId, account",
    accounts: "name",
    // todo commodities
    payees: "++id, name",
    settings: "key"
});

// Mappings

db.accounts.mapToClass(Account)
// todo commodities
db.payees.mapToClass(Payee)
db.postings.mapToClass(Posting)
db.transactions.mapToClass(Transaction)
db.settings.mapToClass(Setting)

export default db