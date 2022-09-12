/**
 * Transaction parser
 * Used for calculation of the empty postings
 */
export class TransactionParser {
  static calculateEmptyPostingAmounts(transactions) {
    // iterate
    transactions.forEach((tx) => {
      const postings = tx.postings

      // todo: what about multiple currencies?
      // do we have multiple currencies?
      const currencies = postings.map((posting) => posting.currency)
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
      //amounts.forEach((amount) => (sum += amount))

      // put this value into the empty posting.
      // let emptyPosting = postings.reduce((prev, curr) =>
      //   curr.amount ? 1 : curr
      // )
      const emptyPostings = postings.filter((posting) => !posting.amount)
      if (emptyPostings.length > 1) {
        throw new Error('multiple empty postings found!')
      }
      let emptyPosting = emptyPostings[0]

      emptyPosting.amount = Number(sum) * -1
    })

    return transactions
  }
}
