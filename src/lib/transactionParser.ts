/**
 * Transaction parser
 * Used for calculation of the empty postings
 */
import { Posting, Transaction } from 'src/model'
import { TransactionAugmenter } from './transactionAugmenter'

export class TransactionParser {
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

  /**
   * Find the amount to display, from the user's perspective - a debit, credit, transfer.
   * Append (amount, currency) to the Transaction record.
   * @param {Array<Transaction>} txs
   */
  static calculateTxAmounts(txs: Transaction[]) {
    // get Amounts
    TransactionAugmenter.calculateEmptyPostingAmounts(txs)

    // Find the asset account and decide on the flow direction.
    txs.forEach((tx) => {
      let amount = 'n/a'
      let currency = ''

      // get the assets posting(s)
      const postings = tx.postings.filter(
        (posting) =>
          posting.account.startsWith('Assets:') ||
          posting.account.startsWith('Liabilities:')
      )
      if (postings.length === 0) {
        console.warn('No postings found in Assets or Liabilities!')
      } else if (postings.length === 1) {
        tx.amount = postings[0].amount?.toFixed(2)
        tx.currency = postings[0].currency
      } else if (postings.length === 2) {
        // transfer
        tx.amount = '<=>'
        // todo: ...
      } else {
        // todo: handle these cases (transfers, complex tx)
        console.warn('more than one posting found with assets')
      }
    })
  }
}
