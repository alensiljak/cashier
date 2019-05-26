/*
    The domain model
*/

export class Account {
    constructor() {
        this.name = null,
        this.balance = null,
        this.currency = null
    }
}

export class Commodity {
    constructor() {
        this.name = null
    }
}

export class Payee {
    constructor(name) {
        // Remember the last transaction, to fill on selection.
        this.name = name
        this.lastTransactionId = null
    }
}

export class Posting {
    constructor() {
        // Id is inserted automatically.
        // this.id = null
        this.transactionId = ""
        this.account = ""
        this.amount = ""
        this.currency = ""
    }
}

export class Transaction {
    constructor() {
        //this.id = newId()
        this.id = null
        this.date = null
        this.payee = ''
        this.note = ''
        this.postings = []
    }
}

export class Setting {
    constructor(key, value) {
        this.key = key,
        this.value = value
    }
}
