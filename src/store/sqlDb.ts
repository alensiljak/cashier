/**
 * SQL implementation using alasql
 */
import alasql from 'alasql'

const dbName = 'Cashier'

class BaseTable {
  tableName: string = undefined

  async getAll() {
    const sql = `select * from ${this.tableName}`
    return this.run(sql)
  }

  async run(sql: string) {
    // initialize
    await Database.attachDatabase()

    return alasql.promise(sql)
  }
}

class Settings extends BaseTable {
  tableName = 'settings'
}

export class Database {
  settings

  constructor() {
    this.settings = new Settings()
  }

  static async attachDatabase() {
    await alasql.promise(`ATTACH INDEXEDDB DATABASE ${dbName};`)
    const database = alasql.databases[dbName]
    if (!database) {
      await Database.createDatabase()
    }

    await alasql.promise(`use ${dbName};`)
  }

  static async createDatabase() {
    console.log(`creating database ${dbName}...`)

    // alasql("create INDEXEDDB DATABASE if not exists localdb_db");
    await alasql.promise(`create database ${dbName};`)

    // tables:

    // todo: This is suspicious. The tables array is empty but has tables as object properties?!
    const database = alasql.databases[dbName]
    const tableNames = Object.keys(database.tables)

    if (tableNames.length === 0) {
      //if (database.tables.length === 0) {
      await Database.createTables()
      await this.createIndices()
    }
  }

  static async createTables() {
    // Tables:
    // (id int, name string, description string, x integer, x varchar(10))
    //alasql("ATTACH INDEXEDDB DATABASE localdb_db;
    //CREATE TABLE db_Settings(setting varchar(50) Primary Key, `value`
    // varchar(300), storeInSession varchar(1) DEFAULT 'N');");
    await alasql.promise(`
        CREATE TABLE IF NOT EXISTS accounts;
        CREATE TABLE IF NOT EXISTS assetAllocation;
        CREATE TABLE IF NOT EXISTS lastTransaction;
        CREATE TABLE IF NOT EXISTS postings;
        CREATE TABLE IF NOT EXISTS scheduled;
        CREATE TABLE IF NOT EXISTS settings;
        CREATE TABLE IF NOT EXISTS transactions;
    `)
  }

  static async createIndices() {
    // todo: indices
    //CREATE INDEX tmp ON table(field);

    console.log('here we would create indices')
  }

  async drop() {
    await alasql.promise(`detach database ${dbName};`)
    return alasql.promise(`drop INDEXEDDB database ${dbName};`)
  }
}

// export default function useDatabase() {
//   // todo: init?
//   var db = new Database()
//   return { db }
// }
