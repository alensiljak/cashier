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
        this.payee = ""
        this.postings = []
    }
}

