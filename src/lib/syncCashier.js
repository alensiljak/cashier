/*
Synchronization module for CashierSync.
*/
import axios from 'axios'
import appService from '../appService'

export class CashierSync {
    constructor(serverUrl) {
        if (serverUrl.endsWith('/')) {
            serverUrl = serverUrl.splice(0, serverUrl.length - 1)
        }
        this.serverUrl = serverUrl
    }

    get(path) {
        let url = this.serverUrl + path
        return axios.get(url)
    }

    async healthCheck() {
        let result = await this.get('/')
        return result.data
    }

    /**
     * Retrieve the list of accounts
     * @returns array of Account objects
     */
    async readAccounts() {
        let url = this.serverUrl + '/balance'

        let response = await axios.get(url)

        let content = response.data
        
        let promise = appService.importBalanceSheet(content)
        
        return promise
    }
}