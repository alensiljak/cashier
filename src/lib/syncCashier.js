/*
  Synchronization with Ledger server.
*/
import ky from 'ky'
import { settings, SettingKeys } from './Configuration'
import { engine } from './AssetAllocation'

/**
 * Cashier Sync class talks to CashierSync on the server. The methods here represent the methods
 * implemented by the server. This is a proxy class for fething Ledger data.
 */
export class CashierSync {
  static accountsCommand = 'accounts'
  //static balancesUrl = '/balance'
  //static currentValuesUrl = '/currentValues'
  static payeesCommand = 'payees'

  constructor(serverUrl) {
    if (!serverUrl) {
      throw new Error('CashierSync URL not set.')
    }
    if (serverUrl.endsWith('/')) {
      serverUrl = serverUrl.substring(0, serverUrl.length - 1)
    }
    this.serverUrl = serverUrl
    //this.balancesUrl = this.serverUrl + CashierSync.balancesUrl
    //this.currentValuesUrl = this.serverUrl + CashierSync.currentValuesUrl
  }

  async get(path, options) {
    const url = new URL(`${this.serverUrl}${path}`)
    const response = await ky(url, options)
    return response
  }

  getAccountsUrl() {
    const url = this.getUrl(CashierSync.accountsCommand)
    return url
  }

  getPayeesUrl() {
    const url = this.getUrl(CashierSync.payeesCommand)
    return url
  }

  getUrl(command) {
    const path = this.getPath(command)
    const url = new URL(`${this.serverUrl}${path}`)
    return url
  }

  getPath(command) {
    return `?command=${command}`
  }

  /**
   * Sends a ledger command to the Ledger server and returns the response.
   * @param {String} command
   */
  async ledger(command, options) {
    const url = this.getUrl(command)

    const response = await ky(url, options)
    return response
  }

  /**
   * See if the server is running
   */
  async healthCheck() {
    // HEAD is enough to check if the server is online.
    const result = await this.get('/ping')
    if (!result.ok) {
      throw new Error('Error contacting Ledger server!')
    }

    const text = await result.text()
    return text
  }

  /**
   * Retrieve the list of accounts
   * @returns array of Account objects
   */
  async readAccounts() {
    const command = CashierSync.accountsCommand
    const response = await this.ledger(command)
    if (!response.ok) {
      throw new Error('Error reading accounts!')
    }

    const content = await response.json()

    return content
  }

  /**
   * Retrieve the account balances.
   * @returns array of Account objects
   */
  async readBalances() {
    const command = 'b --flat --no-total'
    // const url = new URL(this.balancesUrl)
    const response = await this.ledger(command)
    const content = await response.json()

    return content
  }

  /**
   * Get current account values in the base currency.
   * @returns Current account values
   */
  async readCurrentValues() {
    const rootAcct = await settings.get(SettingKeys.rootInvestmentAccount)
    const currency = await settings.get(SettingKeys.currency)

    // const url = new URL(this.currentValuesUrl)
    // const params = {
    //   root: rootAcct,
    //   currency: currency,
    // }
    // Object.keys(params).forEach((key) =>
    //   url.searchParams.append(key, params[key])
    // )

    const command = `b ^${rootAcct} -X ${currency} --flat --no-total`

    //const response = await ky.get(url)
    const response = await this.ledger(command)
    //const result = await response.text()
    const result = await response.json()

    // parse
    const currentValues = this.parseCurrentValues(result, rootAcct)

    await engine.importCurrentValuesJson(currentValues)
    return 'OK'
  }

  parseCurrentValues(lines, rootAccount) {
    let result = {}

    for (const line of lines) {
      if (line === '') continue

      let row = line.trim()

      // split at the root account name
      let rootIndex = row.indexOf(rootAccount)

      let amount = row.substring(0, rootIndex)
      amount = amount.trim()

      let account = row.substring(rootIndex)

      // add to the dictionary
      result[account] = amount
    }

    return result
  }

  async readLots(symbol) {
    const command = `b ^Assets and invest and :${symbol}$ --lots --no-total --collapse`

    //const response = await ky.get(url)
    const response = await this.ledger(command)
    if (!response.ok) throw new Error('error fetching lots: ' + response.text())

    const result = await response.json()

    // remove "Assets" account title
    const lastIndex = result.length - 1
    let lastLine = result[lastIndex]
    if (lastLine.includes('Assets')) {
      let parts = lastLine.split('Assets')
      let value = parts[0]
      result[lastIndex] = value
    }

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
      content: content,
    }

    const response = await ky.post(url, { json: params })
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
      repoPath: repoPath,
    }

    const response = await ky.post(url, { json: params })
    let content = await response.text()
    return content
  }

  async repoCommit(repoPath, commitMessage) {
    let url = `${this.serverUrl}/repo/commit`
    const params = {
      repoPath: repoPath,
      commitMessage: commitMessage,
    }

    const response = await ky.post(url, { json: params })
    const content = await response.text()
    return content
  }

  async repoPush(repoPath) {
    const url = new URL(`${this.serverUrl}/repo/push`)
    const params = {
      repoPath: repoPath,
    }

    const response = await ky.post(url, { json: params })
    const content = await response.text()
    return content
  }

  async repoStatus(repoPath) {
    const url = new URL(`${this.serverUrl}/repo/status`)
    const params = { repoPath: repoPath }
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    )

    let response = await ky.get(url)
    const result = await response.text()
    return result
  }

  async search(searchParams) {
    const url = new URL(`${this.serverUrl}/search`)

    // For GET, use URL Search Params, for POST, use Form Data:
    //const params = new URLSearchParams() // use params.set()
    //Object.keys(searchParams).forEach(key => params.set(key, searchParams[key]))
    //const params = new FormData(); // use params.append()
    //Object.keys(searchParams).forEach(key => params.append(key, searchParams[key]))

    const response = await ky.post(url, { json: searchParams })
    const result = await response.json()
    return result
  }

  async xact(parameters) {
    const url = new URL(`${this.serverUrl}/xact`)
    const response = await ky.post(url, { json: parameters })
    //const result = await response.json()
    const result = await response.text()
    return result
  }

  /**
   * Shutdown CashierSync server from the client app.
   */
  shutdown() {
    return this.get('/shutdown')
  }
}
