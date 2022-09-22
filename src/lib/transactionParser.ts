/**
 * Transaction parser
 * Used for calculation of the empty postings
 */
import { Transaction } from 'src/model'

export class TransactionParser {
  static calculateEmptyPostingAmounts(transactions: Array<Transaction>) {
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
    })

    return transactions
  }
}
