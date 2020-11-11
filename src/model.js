/* eslint-disable no-unused-expressions */
/*
    The domain model
*/

export class Account {
  constructor() {
    this.name = null;
    this.balance = null;
    this.currency = null;
    this.currentValue = null;
    this.currentCurrency = null;
  }
}

export class Commodity {
  constructor() {
    this.name = null;
  }
}

export class Posting {
  constructor() {
    // Id is inserted automatically.
    // this.id = null
    this.transactionId = "";
    this.account = "";
    this.amount = "";
    this.currency = "";
  }
}

/**
 * Used for price download and export. Not used.
 */
export class Price {
  constructor() {
    this.symbol = null; // symbol used in the book
    this.ticker = null; // symbol on the exchange
    this.price = null; // downloaded price
    this.currency = null; // currency of the price
  }
}

export class ScheduledTransaction {
  constructor() {
    this.id = null
    this.nextDate = null
    this.transaction = null
    this.period = null
    this.count = null
    this.endDate = null
    this.remarks = null
  }
}

export class Transaction {
  constructor() {
    // this.id = newId()
    this.id = null;
    this.date = null;
    this.payee = "";
    this.note = "";
    this.postings = [];
  }
}

export class Setting {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}
