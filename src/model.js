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
        this.account = ""
        this.amount = ""
        this.currency = ""
    }
}

export class Transaction {
    constructor() {
        //this.id = newId()
        // this.id = 0
        // this.date = new Date().toISOString().substring(0, 10)
        this.payee = ""
        // this.postings = []
    }
}

