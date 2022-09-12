/* eslint-disable no-unused-expressions */
/*
    The domain model
*/

export class Account {
  name: any
  balance: any
  currency: any
  currentValue: any
  currentCurrency: any
}

export class Commodity {
  name: string | undefined
}

export class LastTransaction {
  payee: string
  transaction: string

  constructor() {
    this.payee = ''
    this.transaction = ''
  }
}

export class Posting {
  id: any
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
  //id: any
  nextDate: any
  transaction: any
  period: any
  count: any
  endDate: any
  remarks: any
}

export class Transaction {
  id: any
  date: any
  payee: string
  note: string
  postings: Posting[]

  constructor() {
    // this.id = newId()
    this.id = null
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
