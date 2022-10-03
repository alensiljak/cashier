import { Account, Transaction } from 'src/model'
import appService from '../appService'
import { TransactionParser } from './transactionParser'

/**
 * Modifies the transaction records in-memory to create the missing parts,
 * like the amount on a missing posting.
 */
export class TransactionAugmenter {
  constructor() {}

  /**
   * Calculates the amounts for the empty postings.
   * @param transactions Array of Transactions
   * @returns The same array of Transactions
   */
  static calculateEmptyPostingAmounts(
    transactions: Transaction[]
  ): Transaction[] {
    // iterate
    transactions.forEach((tx) => {
      const postings = tx.postings

      // todo: what about multiple currencies?
      // do we have multiple currencies?
      let currencies = postings.map((posting) => posting.currency)
      // eliminate blanks
      currencies = currencies.filter((currency) => currency)
      // Convert to a set to get unique values only.
      const currencySet = new Set(currencies)
      if (currencySet.size > 1) {
        console.warn(
          'Multiple currencies detected:',
          ...currencySet,
          '. Ignoring transaction',
          tx.date,
          tx.payee
        )
        return
      }
      // use the common currency
      const commonCurrency = currencySet.values().next().value

      // do we have empty postings?
      const amounts = postings.map((posting) => posting.amount)
      if (amounts.length <= 0) return

      // add all the existing amounts
      const sum = amounts.reduce((prev, curr) => prev + curr)

      // put this value into the empty posting.
      const emptyPostings = postings.filter((posting) => !posting.amount)
      if (emptyPostings.length > 1) {
        throw new Error('multiple empty postings found!')
      } else if (emptyPostings.length === 0) {
        // no empty postings
        return
      }

      const emptyPosting = emptyPostings[0]
      emptyPosting.amount = Number(sum) * -1

      if (!emptyPosting.currency) {
        emptyPosting.currency = commonCurrency
      }
    })

    return transactions
  }

  /**
   * Corrects the account balance by adding the local transactions into the calculation.
   * The initial value is the account's balance from Ledger. Then we calculate the
   * local transactions and adjust the balance accordingly.
   * @param {Array} accounts The list of Account records.
   * @returns {Promise<Array<Account>>} The list of accounts with adjusted balances.
   */
  async adjustAccountBalances(accounts: Account[]): Promise<Array<Account>> {
    if (!accounts) {
      console.info('no favourite accounts found for balance adjustment')
      return accounts
    }

    for (let i = 0; i < accounts.length; i++) {
      // load all postings for the account
      let account = accounts[i]
      // todo: if the favourite account is not found, gray it out?
      if (!account) continue // null check

      // handle empty balances
      if (!account.balance) {
        account.balance = 0
      }

      let sum = parseFloat(account.balance)

      //
      let txs = await appService.loadAccountTransactionsFor(account.name)

      TransactionAugmenter.calculateEmptyPostingAmounts(txs)
      let postings = TransactionParser.extractPostingsFor(txs, account.name)

      for (let j = 0; j < postings.length; j++) {
        let amount = postings[j].amount
        if (!amount) continue
        if (typeof amount === 'string') {
          amount = parseFloat(amount)
        }

        sum += amount

        // For accounts with no starting balance, use the currency from the first expense.
        if (!account.currency) {
          account.currency = postings[j].currency
        }
      }

      if (isNaN(sum)) {
        console.warn('The sum for ' + account.name + ' is not a number: ', sum)
      }

      let newBalance = sum.toFixed(2)

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
      account.balance = new Intl.NumberFormat('en-AU').format(newBalance)
      // { style: 'currency', currency: 'EUR' }
    }
    return accounts
  }
}
