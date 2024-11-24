import { Posting, Transaction } from 'src/model'

/**
 * Find an empty posting, or create one.
 */
export function getEmptyPostingIndex(tx: Transaction) {
    if (!tx) {
        throw new Error('No transaction loaded!')
    }

    for (let i = 0; i < tx.postings.length; i++) {
        const posting = tx.postings[i]
        if (!posting.account && !posting.amount && !posting.currency) {
            return i
        }
    }

    // not found. Create a new one.
    const posting = new Posting()
    tx.postings.push(posting)
    return tx.postings.length - 1
}
