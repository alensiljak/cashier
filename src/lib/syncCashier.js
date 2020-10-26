/*
  Synchronization with CashierSync.
*/
import ky from 'ky'
import { settings, SettingKeys } from './Configuration'
import { engine } from './AssetAllocation'

/**
 * Cashier Sync class talks to CashierSync on the server. The methods here represent the methods
 * implemented by the server. This is a proxy class for fething Ledger data.
 */
export class CashierSync {
  static accountsUrl = '/accounts'
  static balancesUrl = '/balance'
  static currentValuesUrl = '/currentValues'
  static payeesUrl = '/payees'

  constructor(serverUrl) {
    if (!serverUrl) {
      throw 'CashierSync URL not set.'
    }
    if (serverUrl.endsWith('/')) {
      serverUrl = serverUrl.splice(0, serverUrl.length - 1)
    }
    this.serverUrl = serverUrl
    this.accountsUrl = this.serverUrl + CashierSync.accountsUrl
    this.balancesUrl = this.serverUrl + CashierSync.balancesUrl
    this.currentValuesUrl = this.serverUrl + CashierSync.currentValuesUrl
    this.payeesUrl = this.serverUrl + CashierSync.payeesUrl
  }

  async get(path, options) {
    const url = new URL(`${this.serverUrl}${path}`)
    const response = await ky(url, options)
    return response
  }

  /**
   * See if the server is running
   */
  async healthCheck() {
    // HEAD is enough to check if the server is online.
    let result = await this.get('/')
    if (!result.ok) throw 'Error contacting CashierSync server!'

    const text = await result.text()
    return text
  }

  /**
   * Retrieve the list of accounts
   * @returns array of Account objects
   */
  async readAccounts() {
    let url = new URL(this.accountsUrl)
    let response = await ky(url)
    let content = await response.text()

    return content
  }

  /**
   * Retrieve the account balances.
   * @returns array of Account objects
   */
  async readBalances() {
    const url = new URL(this.balancesUrl)
    const response = await ky(url)
    const content = await response.text()

    return content
  }

  async readCurrentValues() {
    const rootAcct = await settings.get(SettingKeys.rootInvestmentAccount)
    const currency = await settings.get(SettingKeys.currency)

    const url = new URL(this.currentValuesUrl)
    const params = {
      root: rootAcct,
      currency: currency
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky.get(url)
    const result = await response.text()

    await engine.importCurrentValues(result)
    return 'OK'
  }

  /**
   * Retrieves the Security Analysis from Cashier Sync.
   * @param {string} symbol
   */
  async readSecurityAnalysis(symbol) {
    const currency = await settings.get(SettingKeys.currency)
    const url = new URL(`${this.serverUrl}/securitydetails`)

    const params = {
      symbol: symbol,
      currency: currency
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky(url)
    const result = await response.text()
    return result
  }

  async readLots(symbol) {
    const url = new URL(this.serverUrl + '/lots')
    const params = { symbol: symbol }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky.get(url)
    const result = await response.text()
    return result
  }

  /**
   * Appends the given content to a file. Used to write the transactions to journal.
   * @param {string} filePath
   * @param {string} content
   */
  async append(filePath, content) {
    const url = new URL(`${this.serverUrl}/append`)
    const params = {
      filePath: filePath,
      content: content
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky.post(url)
    let result = await response.text()
    return result
  }

  /**
   * Pull from the remote repository.
   * @param {string} repoPath The path to the repository.
   */
  async repoPull(repoPath) {
    const url = new URL(`${this.serverUrl}/repo/pull`)
    const params = {
      repoPath: repoPath
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky.post(url)
    let content = await response.text()
    return content
  }

  async repoCommit(repoPath, commitMessage) {
    let url = `${this.serverUrl}/repo/commit`
    const params = {
      repoPath: repoPath,
      commitMessage: commitMessage
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky.post(url, )
    const content = await response.text()
    return content
  }

  async repoPush(repoPath) {
    const url = new URL(`${this.serverUrl}/repo/push`)
    const params = {
      repoPath: repoPath
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await ky.post(url)
    const content = await response.text()
    return content
  }

  async repoStatus(repoPath) {
    const url = new URL(`${this.serverUrl}/repo/status`)
    const params = { repoPath: repoPath }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    let response = await ky.get(url)
    const result = await response.text()
    return result
  }

  async search(searchParams) {
    const url = new URL(`${this.serverUrl}/search`)
    
    //const params = new URLSearchParams() // use params.set()
    //Object.keys(searchParams).forEach(key => params.set(key, searchParams[key]))
    //const params = new FormData(); // use params.append()
    //Object.keys(searchParams).forEach(key => params.append(key, searchParams[key]))
    
    const response = await ky.post(url, { json: { query: searchParams } })
    const result = await response.json()
    return result
  }

  /**
   * Shutdown CashierSync server from the client app.
   */
  shutdown() {
    return this.get('/shutdown')
  }
}
