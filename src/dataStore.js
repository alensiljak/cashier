/*
    Data Access Layer implemented with Dexie.js

    Get unique id:
    var id = (new Date()).getTime();

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
import { Transaction, Posting } from './model';

// Define the schema

const db = new Dexie('Cashier');

db.version(1).stores({
    // transactions: "++id, date, payee, postings"
    transactions: "++id, date",
    postings: "++id, transactionId, account"
    // todo accounts
    // todo commodities
    // todo payees
});

// todo accounts
// todo commodities
// todo payees
db.postings.mapToClass(Posting)
db.transactions.mapToClass(Transaction)

export default db