/*
    The domain model
*/

export class Money {
  amount = 0
  currency = ''
}

export class Account {
  balance?: Money

  name = ''
  balances?: Record<string, number>
  // currency: any
  currentValue: any
  currentCurrency: any

  constructor(accountName: string) {
    this.name = accountName
    //this.balances['EUR'] = 30
  }
}

export class LastTransaction {
  payee = ''
  transaction?: Transaction
}

export class Payee {
  // id?: number
  name = ''

  constructor(name: string) {
    this.name = name
  }
}

export class Posting {
  id?: number
  transactionId: string | any
  account: string
  amount?: number
  currency: string

  constructor() {
    // Id is inserted automatically.
    // this.id = null
    this.transactionId = ''
    this.account = ''
    this.currency = ''
  }
}

/**
 * Intended for price download and export.
 * Not used.
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
  transaction?: Transaction
  period: any
  count?: number
  endDate: any
  remarks: any
}

export class Transaction {
  id?: number
  date?: string
  payee?: string
  note?: string
  postings: Posting[]
  //
  //amount: any
  //currency: any

  constructor() {
    // this.id = newId()
    this.date = ''
    this.payee = ''
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
