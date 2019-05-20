/*
    Data Access Layer implemented with Dexie.js

    var db = new Dexie("MyAppDB");

    db.version(1).stores({
        folders: "++id,&path",
        files: "++id,filename,extension,folderId"
    });
    db.folders.mapToClass(Folder);
    db.files.mapToClass(File);
});
*/
import Dexie from 'dexie';
import { Account, Transaction, Posting } from './model';

// Define the schema

const db = new Dexie('Cashier');

db.version(1).stores({
    // transactions: "++id, date, payee, postings"
    transactions: "++id, date",
    postings: "++id, transactionId, account",
    accounts: "name"
    // todo commodities
    // todo payees
});

db.postings.mapToClass(Account)
// todo commodities
// todo payees
db.postings.mapToClass(Posting)
db.transactions.mapToClass(Transaction)

export default db