/*
    The domain model
*/

// let newId = function() {
// return new Date().getTime()
// }

export class Payee {

}

export class Posting {
    constructor() {
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
        this.date = null // new Date().toISOString().substring(0, 10)
        this.payee = ""
        // this.postings = []
    }
}

