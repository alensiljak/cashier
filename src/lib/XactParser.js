/**
 * Parse Ledger's XACT output into a transaction.
 */
import { Transaction, Posting } from '../model'

export class XactParser {
  constructor() {}

  echo(msg) {
    return msg
  }

  parse(xactOutput) {
    const tx = new Transaction()

    // separate the lines.
    let lines = xactOutput.split('\n')
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue

      if (i === 0) {
        // => header
        tx.date = line.substring(0, 10)
        tx.payee = line.substring(11)
      } else {
        // posting
        var p = new Posting()
        
        // the account is from the beginning until the first double space
        const accountEnd = line.indexOf('  ')
        if (accountEnd === -1) {
          // contains just the account
          p.account = line
        } else {
          p.account = line.substring(0, accountEnd)
          // amount & currency
          var remains = line.substring(accountEnd).trim()
          var amountEnd = remains.indexOf(' ')
          p.amount = remains.substring(0, amountEnd).trim()
          p.currency = remains.substring(amountEnd).trim()
        }

        tx.postings.push(p)
      }
    }

    return tx
  }
}

// export default XactParser
