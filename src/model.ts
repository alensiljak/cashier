/* eslint-disable no-unused-expressions */
/*
    The domain model
*/

export class Account {
  name = ''
  balance?: number
  currency: any
  currentValue: any
  currentCurrency: any
}

export class Commodity {
  name?: string
}

export class LastTransaction {
  payee = ''
  transaction?: Transaction
}

export class Posting {
  id?: number
  transactionId: string | any
  account: string
  amount: any
  currency: string

  constructor() {
    // Id is inserted automatically.
    // this.id = null
    this.transactionId = ''
    this.account = ''
    this.amount = ''
    this.currency = ''
  }
}

/**
 * Used for price download and export. Not used.
 */
export class Price {
  // symbol used in the book
  symbol: string | undefined
  // symbol on the exchange
  ticker: string | undefined
  // downloaded price
  price: any
  // currency of the price
  currency: string | undefined
}

export class ScheduledTransaction {
  id?: number
  nextDate: any
  /**
   * Transaction in JSON
   */
  transaction?: Transaction
  period: any
  count: any
  endDate: any
  remarks: any
}

export class Transaction {
  id?: number
  date?: any
  payee: string
  note: string
  postings: Posting[]
  //
  //amount: any
  //currency: any

  constructor() {
    // this.id = newId()
    this.date = null
    this.payee = ''
    this.note = ''
    this.postings = []
  }

  static create() {
    const tx = new Transaction()
    tx.date = new Date().toISOString().substring(0, 10)

    tx.postings.push(new Posting())
    tx.postings.push(new Posting())

    return tx
  }
}

export class Setting {
  key: string
  value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }
}
