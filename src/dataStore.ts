/*
    Data Access Layer implemented with Dexie.js

    Useful links
    - https://dexie.org/docs/Tutorial/Design#database-versioning
*/
import Dexie, { Table } from 'dexie'
import {
  Account,
  LastTransaction,
  Transaction,
  Posting,
  ScheduledTransaction,
  Setting,
} from './model'
import AssetClass from './lib/AssetClass'

// Define the schema

interface CashierDatabase extends Dexie {
  accounts: Table
  assetAllocation: Table
  lastTransaction: Table
  postings: Table
  transactions: Table
  settings: Table
  scheduled: Table
}

const db: CashierDatabase = new Dexie('Cashier')

// Schema

db.version(0.1).stores({
  // transactions: "++id, date, payee, postings"
  transactions: '++id, date',
  postings: '++id, transactionId, account',
  accounts: 'name',
  settings: 'key',
})
db.version(0.2).stores({
  assetAllocation: 'fullname',
})
db.version(2).stores({
  scheduled: '++id, nextDate',
})
db.version(2.1).stores({
  lastTransaction: 'payee',
})

// Mappings

db.accounts.mapToClass(Account)
db.assetAllocation.mapToClass(AssetClass)
db.lastTransaction.mapToClass(LastTransaction)
db.postings.mapToClass(Posting)
db.transactions.mapToClass(Transaction)
db.settings.mapToClass(Setting)
db.scheduled.mapToClass(ScheduledTransaction)

export default db
