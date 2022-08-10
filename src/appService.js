/*
    Provide service layer for the application.

    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
*/
import db from './dataStore'
import { Account, LastTransaction, Transaction } from './model'
import { Notify } from 'quasar'
import { settings, SettingKeys } from './lib/Configuration'

class AppService {
  /**
   * Clears Ids and reference Ids in Transaction and Postings.
   * @param {Transaction} tx
   */
  clearIds(tx) {
    delete tx.id
    tx.postings.forEach(posting => {
      delete posting.id
      delete posting.transactionId
    })
    return tx
  }

  createAccount(name) {
    let acc = new Account()
    acc.name = name

    return db.accounts.add(acc)
  }

  get db() {
    return db
  }

  deleteAccount(name) {
    return db.accounts.delete(name)
  }

  async deleteAccounts() {
    return db.accounts.clear()
  }

  /**
   * Delete transaction and related postings.
   * @param {*} id Int/long id of the transaction to delete
   */
  async deleteTransaction(id) {
    if (typeof id === 'string') {
      id = Number(id)
    }

    await this.db.transaction(
      'rw',
      this.db.transactions,
      this.db.postings,
      async tx => {
        const x = await db.transactions
          .where('id')
          .equals(id)
          .count()
        console.log('count:', x)

        // delete transaction record
        let result = await db.transactions
          .where('id')
          .equals(id)
          .delete()
        console.log('transactions -', result)

        // delete postings
        result = await db.postings
          .where('transactionId')
          .equals(id)
          .delete()
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

  async duplicateTransaction(tx) {
    // copy a new transaction
    const newTx = JSON.parse(JSON.stringify(tx))

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

    var output = ''

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
  readFile(fileInfo, callback) {
    if (!fileInfo) return
    //   console.log(fileInfo);

    var reader = new FileReader()

    reader.onload = event => {
      // File was successfully read.
      var content = event.target.result

      callback(content)
    }

    reader.readAsText(fileInfo)
  }

  /**
   * Translates Transaction into a ledger entry.
   * @param {Transaction} tx
   * @returns {String} A ledger entry
   */
  translateToLedger(tx) {
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
  formatNumber(value) {
    // if (!value) return;
    if (value == null) return
    if (Number.isNaN(value)) return

    // make sure we have a number
    var result = Number(value)
    // let val = (value/1).toFixed(2).replace('.', ',')
    // return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return result.toFixed(2)
  }

  /**
   * Get all the investment accounts in a dictionary.
   * Start from the investment root setting, and include the commodity.
   * @returns Promise with investment accounts collection
   */
  async getInvestmentAccounts() {
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
  async getInvestmentCommodities() {
    // get all investment accounts, iterate to get unique commodities?
    let commodities = []

    const accounts = await this.getInvestmentAccounts()
    await accounts.each(account => {
      commodities.push(account.currency)
    })

    // keep only unique values
    commodities = [...new Set(commodities)]
    commodities.sort()

    return commodities
  }

  async importAccounts(accountsList) {
    if (!accountsList) {
      throw new Error('The accounts list is required!')
    }

    const accounts = []

    for (let i = 0; i < accountsList.length; i++) {
      const line = accountsList[i]
      if (line === '') continue

      const account = new Account()
      account.name = line
      accounts.push(account)
    }

    return db.accounts.bulkPut(accounts)
  }

  async importBalanceSheet(text) {
    if (!text) {
      throw 'No balance sheet sent for import'
    }

    const accounts = []
    const mainCurrency = await settings.get(SettingKeys.currency)
    let mainCurrencyAmount = null
    let multicurrencyAccount = false

    // read and parse the balance sheet string
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
      // console.log(lines[i]);
      const line = lines[i]
      if (line === '') continue

      const account = new Account()
      let namePart = line.substring(21).trim()

      let balancePart = line.substring(0, 20)
      balancePart = balancePart.trim()
      // separate the currency
      const balanceParts = balancePart.split(' ')

      let amountPart = balanceParts[0]
      // clean-up the thousand-separators
      amountPart = amountPart.replace(/,/g, '')
      account.balance = parseFloat(amountPart)

      // currency
      let currencyPart = balanceParts[1]
      account.currency = currencyPart

      // name
      account.name = namePart

      // If we have a currency but no account, it's a multicurrency account.
      if (!namePart) {
        if (currencyPart) {
          multicurrencyAccount = true

          if (currencyPart === mainCurrency) {
            mainCurrencyAmount = account.balance
          }
        }

        continue
      }

      if (multicurrencyAccount) {
        // Use the main currency.
        account.currency = mainCurrency
        account.balance = mainCurrencyAmount

        // reset the indicator.
        multicurrencyAccount = false
        mainCurrencyAmount = null
      }

      accounts.push(account)
    }

    return db.accounts.bulkPut(accounts)
  }

  importCommodities(text) {
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
   * Imports Scheduled Transactions from a JSON String backup (from the export file).
   * @param {String} jsonList
   */
  async importScheduledTransactions(jsonList) {
    if (!jsonList) {
      throw new Error('The transactions list is required!')
    }

    const parsed = JSON.parse(jsonList)
    // console.debug(parsed)
    // first delete all existing records?
    await db.scheduled.clear()

    await db.scheduled.bulkPut(parsed)
  }

  async loadAccount(id) {
    return db.accounts.get(id)
  }

  /**
   * @returns Collection
   */
  loadAccounts() {
    return db.accounts.orderBy('name')
  }

  loadAssetClass(fullname) {
    return db.assetAllocation.get(fullname)
  }

  async loadFavouriteAccounts() {
    let favArray = await settings.get(SettingKeys.favouriteAccounts)
    if (!favArray) {
      return null
    }

    // load account details
    let accounts = await db.accounts.bulkGet(favArray)

    // Handle any accounts that have not been found
    for (var i = 0; i < accounts.length; i++) {
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
  async loadTransaction(id) {
    if (typeof id === 'string') {
      throw new Error('numeric ids are required as keys!')
    }

    const tx = await db.transactions.get(id)
    // load postings
    const postings = await db.postings.where({ transactionId: tx.id }).toArray()

    tx.postings = postings
    return tx
  }

  saveAccount(account) {
    return db.accounts.put(account)
  }

  /**
   * Saves the given transaction as the Last Transaction for the Payee.
   * This is retrieved when the Payee is selected on a new transaction, or when editing.
   * @param {Transaction} tx
   */
  async saveLastTransaction(tx) {
    let lastTx = new LastTransaction()
    lastTx.payee = tx.payee

    lastTx.transaction = tx

    // Delete unneeded properties - the ids, date, etc.
    this.clearIds(lastTx.transaction)

    // no need to remember the date
    delete lastTx.transaction.date

    await this.db.lastTransaction.put(lastTx)

    return true
  }

  /**
   * Ensures correct data/types for new postings during saving.
   * Removes the missing postings.
   */
  async adjustPostings(tx) {
    var newPostingIds = []

    // modifications
    for (let i = 0; i < tx.postings.length; i++) {
      // set transaction id on postings
      tx.postings[i].transactionId = tx.id

      // Make sure all the values are numbers!
      if (typeof tx.postings[i].amount === 'string') {
        const numericValue = parseFloat(tx.postings[i].amount)
        tx.postings[i].amount = numericValue
      }

      newPostingIds.push(tx.postings[i].id)
    }

    // Delete any removed postings.
    // Get the posting ids from the database.
    var postings = await db.postings.where({ transactionId: tx.id }).toArray()
    var oldPostingIds = []
    for (let i = 0; i < postings.length; i++) {
      oldPostingIds.push(postings[i].id)
    }
    for (let i = 0; i < oldPostingIds.length; i++) {
      let oldPostingId = oldPostingIds[i]

      if (newPostingIds.indexOf(oldPostingId) < 0) {
        // console.log('delete', oldPostingIds[i])
        db.postings.delete(oldPostingIds[i])
      }
    }
  }

  async saveScheduledTransaction(stx) {
    if (!stx.id) {
      stx.id = new Date().getTime()
      // console.log('new id generated:', this.scheduledTx.id)
    }

    let result = await this.db.scheduled.put(stx)
    //console.debug('saving schtx:', result)

    return result
  }

  /**
   * Save the transaction to the database.
   * @param {Transaction} tx The transaction object
   * @returns the numeric id of the new transaction
   */
  async saveTransaction(tx) {
    if (!tx.id) {
      // create a new id for the transaction
      tx.id = new Date().getTime()
    }

    this.adjustPostings(tx)

    // save all items in a transaction
    var id = await db.transaction(
      'rw',
      db.transactions,
      db.postings,
      async () => {
        db.postings.bulkPut(tx.postings)

        //delete tx.postings

        // returns the transaction id
        var id = await db.transactions.put(tx)
        return id
      }
    )
    return id
  }
}

// export const appService = new AppService();
export default new AppService()
