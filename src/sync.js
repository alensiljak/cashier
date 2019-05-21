/*
    Synchronization code. 
    Connecting to an instance of hledger-web
*/
import axios from 'axios'

export class SyncService {
    constructor(serverUrl) {
        if (serverUrl.endsWith('/')) {
            serverUrl = serverUrl.splice(0, serverUrl.length - 1)
        }
        this.serverUrl = serverUrl
    }

    readAccounts() {
        let url = this.serverUrl + '/accounts'
        return axios.get(url).then(response => {
            console.log(response)
            return response
        })
    }
}

// export default new SyncService()