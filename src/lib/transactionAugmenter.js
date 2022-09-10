import appService from '../appService'

/**
 * Modifies the transaction records in-memory to create the missing parts,
 * like the amount on a missing posting.
 */
export class TransactionAugmenter {
  constructor() {}

  /**
   * Corrects the account balance by adding the local transactions into the calculation.
   * The initial value is the account's balance from Ledger. Then we calculate the
   * local transactions and adjust the balance accordingly.
   * @param {Array} accounts The list of Account records.
   * @returns {Array} The list of accounts with adjusted balances.
   */
  async adjustBalances(accounts) {
    if (!accounts) {
      console.info('no favourite accounts found for balance adjustment')
      return
    }

    for (let i = 0; i < accounts.length; i++) {
      // load all postings for the account
      let account = accounts[i]
      // todo: if the favourite account is not found, gray it out?
      if (!account || !account.balance) continue // null check

      let sum = parseFloat(account.balance)
      if (!sum) continue

      let postings = await appService.db.postings.where({
        account: account.name,
      })
      let postingsArray = await postings.toArray()
      for (let j = 0; j < postingsArray.length; j++) {
        let amount = postingsArray[j].amount
        if (!amount) continue
        if (typeof amount === 'string') {
          amount = parseFloat(amount)
        }

        sum += amount
      }

      if (isNaN(sum)) {
        console.warn('The sum for ' + account.name + ' is not a number: ', sum)
      }

      let newBalance = sum.toFixed(2)

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
      account.balance = new Intl.NumberFormat('en-AU') // { style: 'currency', currency: 'EUR' }
        .format(newBalance)
    }
    return accounts
  }
}
