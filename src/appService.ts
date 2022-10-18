/*
    Provide service layer for the application.

    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
*/
import db from './store/indexedDb'
import {
  Account,
  AccountBalance,
  LastTransaction,
  Payee,
  Posting,
  ScheduledTransaction,
  Transaction,
} from './model'
import { Notify } from 'quasar'
import { settings, SettingKeys } from './lib/settings'
import { toRaw } from 'vue'
import { TransactionParser } from './lib/transactionParser'
import { TransactionAugmenter } from './lib/transactionAugmenter'
import { Collection } from 'dexie'

class AppService {
  /**
   * Clears Ids and reference Ids in Transaction and Postings.
   * @param {Transaction} tx
   */
  clearIds(tx: Transaction) {
    delete tx.id
    tx.postings.forEach((posting: Posting) => {
      delete posting.id
      delete posting.transactionId
    })
    return tx
  }

  createAccount(name: string) {
    const acc = new Account(name)
    return db.accounts.add(acc)
  }

  get db() {
    return db
  }

  deleteAccount(name: string) {
    return db.accounts.delete(name)
  }

  async deleteAccounts() {
    return db.accounts.clear()
  }

  /**
   * Delete transaction and related postings.
   * @param {*} id Int/long id of the transaction to delete
   */
  async deleteTransaction(id: number) {
    if (typeof id === 'string') {
      id = Number(id)
    }

    await this.db.transaction(
      'rw',
      this.db.transactions,
      this.db.postings,
      async (tx) => {
        const x = await db.transactions.where('id').equals(id).count()
        console.log('count:', x)

        // delete transaction record
        let result = await db.transactions.where('id').equals(id).delete()
        console.log('transactions -', result)

        // delete postings
        result = await db.postings.where('transactionId').equals(id).delete()
        console.log('postings -', result)

        return 'Transaction complete'
      }
    )
    console.log('Delete transaction completed.', id)
    //.catch(error => console.error('Error on Delete Transaction:', error))
  }

  /**
   * Delete all transactions.
   */
  async deleteTransactions() {
    // also clear any remaining postings
    this.db.postings.clear()
    await this.db.transactions.clear()
  }

  async duplicateTransaction(tx: Transaction) {
    // copy a new transaction
    const newTx = toRaw(tx)

    this.clearIds(newTx)

    // return the transaction
    return newTx
  }

  /**
   * Returns all the register transactions as text,
   * ready to be exported as a file or copied as a string.
   */
  async getExportTransactions() {
    const txs = await db.transactions.orderBy('date').toArray()

    let output = ''

    for (let i = 0; i < txs.length; i++) {
      let tx = txs[i]

      if (i > 0) {
        output += '\n' // space between transactions
      }

      output += this.translateToLedger(tx)
    }
    return output
  }

  /**
   * Load data from a file.
   * @param {FileInfo} fileInfo The file info from the input control.
   * @param {Function} callback A function to run when complete, passing the file content.
   */
  readFile(fileInfo: Blob, callback: any): void {
    if (!fileInfo) return
    //   console.log(fileInfo);

    let reader = new FileReader()

    reader.onload = (event) => {
      // File was successfully read.
      let content = event.target?.result

      callback(content)
    }

    reader.readAsText(fileInfo)
  }

  async readFileAsync(fileInfo: Blob) {
    if (!fileInfo) return

    return new Promise((resolve, reject) => {
      //   console.log(fileInfo);

      let reader = new FileReader()

      reader.onload = (event) => {
        // File was successfully read.
        let content = event?.target?.result

        resolve(content)
      }

      reader.readAsText(fileInfo)
    })
  }

  /**
   * Translates Transaction into a ledger entry.
   * @param {Transaction} tx
   * @returns {String} A ledger entry
   */
  translateToLedger(tx: Transaction) {
    let output = ''

    // transaction
    output += tx.date
    output += ' ' + tx.payee
    output += '\n'

    // note
    if (tx.note) {
      output += '    ; ' + tx.note + '\n'
    }

    // postings
    for (let i = 0; i < tx.postings.length; i++) {
      let p = tx.postings[i]
      if (!p.account) continue

      output += '    '
      output += p.account == null ? '' : p.account
      if (p.amount) {
        output += '  '
        output += p.amount == null ? '' : p.amount
        output += ' '
        output += p.currency == null ? '' : p.currency
      }
      output += '\n'
    }

    return output
  }

  /**
   * Format a given value as a number with 2 decimals.
   * @param {*} value
   */
  formatNumber(value: number): string | null {
    // if (!value) return;
    if (value == null) return null
    if (Number.isNaN(value)) return null

    // make sure we have a number
    let result = Number(value)
    // let val = (value/1).toFixed(2).replace('.', ',')
    // return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return result.toFixed(2)
  }

  /**
   * Get all the investment accounts in a dictionary.
   * Start from the investment root setting, and include the commodity.
   * @returns Promise with investment accounts collection
   */
  async getInvestmentAccounts(): Promise<Collection<Account>> {
    // get the root investment account.
    const rootAccount = await settings.get(SettingKeys.rootInvestmentAccount)

    if (!rootAccount) {
      throw new Error('Root investment account not set!')
    }

    return this.db.accounts.where('name').startsWithIgnoreCase(rootAccount)
  }

  /**
   * Get all the investment commodities. These are commodities used in inv. accounts.
   */
  async getInvestmentCommodities(): Promise<string[]> {
    // get all investment accounts, iterate to get unique commodities?
    let commodities: string[] = []

    const accounts = await this.getInvestmentAccounts()
    await accounts.each((account) => {
      if (!account.balances) return

      const accountCommodities = Object.keys(account.balances)
      commodities.push(...accountCommodities)
    })

    // keep only unique values
    commodities = [...new Set(commodities)]
    commodities.sort()

    return commodities
  }

  /**
   * Deprecated. Now using importBalanceSheet instead.
   * Imports accounts list from Ledger.
   * @param accountsList Output of `ledger accounts`
   * @returns
   */
  async importAccounts(accountsList: string[]) {
    if (!accountsList) {
      throw new Error('The accounts list is required!')
    }

    const accounts = []

    for (let i = 0; i < accountsList.length; i++) {
      const line = accountsList[i]
      if (line === '') continue

      const account = new Account('')
      account.name = line
      accounts.push(account)
    }

    return db.accounts.bulkPut(accounts)
  }

  /**
   * Imports the accounts list with their balances.
   * Populates the Account balances. Reads the balances from a Ledger report.
   * 10,000 AUD  Assets:Bank Account
   * @param lines Output of `ledger balance --flat`
   * @returns The promise resolving to the id of the last record updated (Dexie default)
   */
  async importBalanceSheet(lines: string[]): Promise<any> {
    if (!lines || !lines.length) {
      throw new Error('No balance records received for import!')
    }

    const mainCurrency = await settings.get(SettingKeys.currency)
    if (!mainCurrency) {
      throw new Error('No default currency set!')
    }

    const accounts: Account[] = [] // the array of accounts to be updated.

    let account = new Account('')
    // balance
    let accountBalances: Record<string, number> = {}

    // read and parse the balance sheet entries
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line === '') continue

      // name
      let namePart = line.substring(21).trim()
      account.name = namePart

      let balancePart = line.substring(0, 20)
      balancePart = balancePart.trim()
      // separate the currency
      const balanceParts = balancePart.split(' ')

      // currency
      let currencyPart = balanceParts[1]
      if (typeof currencyPart === 'undefined') {
        currencyPart = 'N/A'
      }

      let amountPart = balanceParts[0]
      // clean-up the thousand-separators
      amountPart = amountPart.replace(/,/g, '')

      accountBalances[currencyPart] = parseFloat(amountPart)

      // If we do not have a name, it's an amount of a multicurrency account.
      // Keep the balance until we get the line with the account name.
      if (!namePart) continue

      // Once we have the name, assign the balances dictionary and keep for update.
      account.balances = accountBalances
      accounts.push(account)

      // clean-up.
      account = new Account('')
      accountBalances = {}
    }

    return db.accounts.bulkPut(accounts)
  }

  importCommodities(text: string) {
    if (!text) {
      Notify.create({ message: 'No data to import.' })
      return
    }

    const commodities = []
    const lines = text.split('\n')

    for (let i = 0; i < lines.length - 1; i++) {
      const commodity = lines[i].trim()
      commodities.push(commodity)
    }

    // todo: save

    return commodities
  }

  /**
   * Imports the payees into storage.
   * @param payees Array of payee names from Ledger.
   */
  async importPayees(payeeNames: string[]): Promise<void> {
    let payees = payeeNames.map((name) => new Payee(name))
    await db.payees.bulkAdd(payees)
  }

  /**
   * Imports Scheduled Transactions from a JSON String backup (from the export file).
   * @param {String} jsonList
   */
  async importScheduledTransactions(jsonList: string) {
    if (!jsonList) {
      throw new Error('The transactions list is required!')
    }

    const parsed = JSON.parse(jsonList)
    // console.debug(parsed)
    // first delete all existing records?
    await db.scheduled.clear()

    await db.scheduled.bulkPut(parsed)
  }

  async loadAccount(name: string) {
    return db.accounts.get(name)
  }

  /**
   * Loads all transactions for the given account name.
   * Used to calculate the balance.
   * @param {String} accountName
   */
  async loadAccountTransactionsFor(
    accountName: string
  ): Promise<Transaction[]> {
    // get all the transactions which have postings that have this account.
    let txIds: number[] = []
    await db.postings
      .where({ account: accountName })
      .each((posting) => txIds.push(posting.transactionId))

    let txs = await db.transactions.bulkGet(txIds)

    txs = TransactionAugmenter.calculateEmptyPostingAmounts(txs)

    return txs
  }

  loadAssetClass(fullname: string) {
    return db.assetAllocation.get(fullname)
  }

  /**
   * Loads the favourite accounts.
   * @returns {Array} List of Account records which are marked as Favourites.
   */
  async loadFavouriteAccounts(): Promise<Account[]> {
    let favArray = await settings.get(SettingKeys.favouriteAccounts)
    if (!favArray) {
      return []
    }

    // load account details
    let accounts = await db.accounts.bulkGet(favArray)

    // Handle any accounts that have not been found
    for (let i = 0; i < accounts.length; i++) {
      let account = accounts[i]
      if (account === undefined) {
        // the account has been removed but the Favourites record exists.
        accounts.splice(i, 1)
        i--
      }
    }

    return accounts
  }

  /**
   * Load single transaction with postings.
   * @param {int} id Transaction id
   * @returns Transaction with Postings
   */
  async loadTransaction(id: number) {
    if (typeof id === 'string') {
      throw new Error('numeric ids are required as keys!')
    }

    const tx = await db.transactions.get(id)

    return tx
  }

  saveAccount(account: Account) {
    return db.accounts.put(account)
  }

  /**
   * Saves the given transaction as the Last Transaction for the Payee.
   * This is retrieved when the Payee is selected on a new transaction, or when editing.
   * @param {Transaction} tx
   */
  async saveLastTransaction(tx: Transaction) {
    let lastTx = new LastTransaction()
    lastTx.payee = tx.payee as string

    lastTx.transaction = tx

    // Delete unneeded properties - the ids, date, etc.
    this.clearIds(lastTx.transaction)

    // no need to remember the date
    delete lastTx.transaction.date

    await this.db.lastTransaction.put(lastTx)

    return true
  }
}

// export const appService = new AppService();
export default new AppService()
