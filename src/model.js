/*
    The domain model
*/

export class Payee {

}

export class Posting {
    constructor() {
        this.account = ""
        this.amount = ""
        this.currency = ""
    }
}

export class Transaction {
    constructor() {
        this.date = new Date()
        this.payee = ""
        this.postings = []
    }
}
