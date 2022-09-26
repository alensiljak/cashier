/**
 * Transaction parser
 * Used for calculation of the empty postings
 */
import { Posting, Transaction } from 'src/model'

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
}
