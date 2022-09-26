/**
 * Transaction parser
 * Used for calculation of the empty postings
 */
import { Posting, Transaction } from 'src/model'

export class TransactionParser {
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
   * Extract the postings for the given account from the list of Transactions
   * @param accountName The name of the account
   */
  static extractPostingsFor(
    txs: Transaction[],
    accountName: string
  ): Posting[] {
    let result: Posting[] = []

    txs.forEach((tx) => {
      let postings = tx.postings.filter(
        (posting) => posting.account == accountName
      )
      result = result.concat(postings)
    })
    return result
  }
}
