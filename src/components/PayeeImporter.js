/*
    Processes a list of Payees and loads them into the store.
*/

export default class PayeeImporter {
    constructor() {

    }
    // property
    // get test() {
    //     return "blah"
    // }
    // method
    import(text) {
        // split the input
        var arrayOfLines = text.match(/[^\r\n]+/g)
        console.log(arrayOfLines)
        return arrayOfLines
    }
    
}