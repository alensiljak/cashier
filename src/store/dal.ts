/**
 * Data Access Layer for permanent storage (indexeddb)
 */

import { IndexableType } from 'dexie'
import { ScheduledTransaction, Transaction } from 'src/model'
import db from './indexedDb'

class CashierDAL {
  /**
   * @returns Collection
   */
  loadAccounts() {
    return db.accounts.orderBy('name')
  }

  async saveScheduledTransaction(stx: ScheduledTransaction) {
    if (!stx.id) {
      stx.id = new Date().getTime()
      // console.log('new id generated:', this.scheduledTx.id)
    }

    let result = await db.scheduled.put(stx)
    //console.debug('saving schtx:', result)

    return result
  }

  /**
   * Save the transaction to the database.
   * @param {Transaction} tx The transaction object
   * @returns the numeric id of the new transaction
   */
  async saveTransaction(tx: Transaction): Promise<number> {
    if (!tx) {
      throw new Error('transaction object is invalid!', tx)
    }
    if (!tx.id) {
      // create a new id for the transaction
      tx.id = new Date().getTime()
    }

    // convert to pocos
    //let postings = tx.postings.map((txposting) => toRaw(txposting))
    let postings = tx.postings
    // check whether the accounts exist!
    if (postings.length) {
      const accounts = await this.loadAccounts().toArray()
      const accountNames = accounts.map((account) => account.name)

      postings.forEach((posting) => {
        const account = posting.account
        if (!accountNames.includes(account)) {
          throw new Error(
            `The account ${account} does not exist! Please create first.`
          )
        }
      })
    }
    //tx.postings = postings

    this._processPostings(tx)

    // save all items in a transaction
    let id = await db.transaction(
      'rw',
      db.transactions,
      db.postings,
      async () => {
        db.postings.bulkPut(tx.postings)

        //delete tx.postings

        // returns the transaction id
        let id = await db.transactions.put(tx)
        return id
      }
    )
    return id as number
  }

  /**
   * Ensures correct data/types for new postings during saving.
   * Removes the missing postings.
   */
  async _processPostings(tx: Transaction) {
    // modifications
    // set transaction id on postings
    tx.postings.forEach((posting) => (posting.transactionId = tx.id as number))
    let newPostingIds = tx.postings.map((posting) => posting.id)

    // todo: Ensure only one posting with no amount (ledger requirement)?

    // Delete any removed postings in the database. Get the posting ids from the existing record.
    await this._deleteRemovedPostings(newPostingIds, tx.id)
  }

  async _deleteRemovedPostings(newPostingIds: number[], txId?: number) {
    if (!newPostingIds) return
    if (!txId) return

    let existingTx: Transaction = await db.transactions.get(txId)
    let postings = existingTx.postings
    let oldPostingIds = postings.map((posting) => posting.id) as number[]

    for (let i = 0; i < oldPostingIds.length; i++) {
      let oldPostingId = oldPostingIds[i]

      if (newPostingIds.indexOf(oldPostingId) < 0) {
        // console.log('delete', oldPostingIds[i])
        db.postings.delete(oldPostingIds[i])
      }
    }
  }
}

export default CashierDAL
