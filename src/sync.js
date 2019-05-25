/*
    Synchronization code. 
    Connecting to an instance of hledger-web
*/
import axios from 'axios'
import { Account } from './model';

export class SyncService {
    constructor(serverUrl) {
        if (serverUrl.endsWith('/')) {
            serverUrl = serverUrl.splice(0, serverUrl.length - 1)
        }
        this.serverUrl = serverUrl
    }

    /**
     * Retrieve the list of accounts
     * @returns array of Account objects
     */
    async readAccounts() {
        let url = this.serverUrl + '/accounts'

        let response = await axios.get(url)
        // console.log('received', response)

        let rawArray = response.data
        let accounts = []
        for (let i = 0; i < rawArray.length; i++) {
            let rawItem = rawArray[i]
            if (rawItem.aname === 'root') continue

            let account = new Account()

            account.name = rawItem.aname

            let amount = rawItem.aibalance[0].aquantity.decimalMantissa
            let decimalPlaces = rawItem.aibalance[0].aquantity.decimalPlaces
            // now we need to add the decimal separator at the right place
            let amountString = String(amount)
            let amountArray = amountString.split('')
            let position = amountString.length - decimalPlaces
            amountArray.splice(position, 0, ".")
            amountString = amountArray.join('')
            amount = parseFloat(amountString)
            amount = amount.toFixed(decimalPlaces)
            account.balance = amount

            account.commodity = rawItem.aibalance[0].acommodity

            accounts.push(account)
        }
        
        return accounts
    }
}

// export default new SyncService()