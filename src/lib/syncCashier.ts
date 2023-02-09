/*
  Synchronization with Ledger server.
*/
import ky from 'ky'
import { settings, SettingKeys } from './settings'
import { engine } from './AssetAllocation'
import moment from 'moment'

/**
 * Cashier Sync class talks to CashierSync on the server. The methods here represent the methods
 * implemented by the server. This is a proxy class for fething Ledger data.
 */
export class CashierSync {
  //static accountsCommand = 'accounts'
  /**
   * This returns all the accounts and also includes the balances
   */
  static accountsCommand = 'b --flat --empty --no-total'
  static payeesCommand = 'payees'

  serverUrl: string

  constructor(serverUrl: string) {
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

  async get(path: string, options?: object) {
    const url = new URL(`${this.serverUrl}${path}`)
    const response = await ky(url, options)
    return response
  }

  getPayeesUrl(): URL {
    const url = this.createUrl(CashierSync.payeesCommand)
    return url
  }

  createUrl(command: string): URL {
    const path = this.createPath(command)
    const url = new URL(`${this.serverUrl}${path}`)
    return url
  }

  createPath(command: string) {
    return `?command=${command}`
  }

  /**
   * Sends a ledger command to the Ledger server and returns the response.
   * @param {String} command
   */
  async ledger(command: string, options?: object) {
    const url = this.createUrl(command)

    const response = await ky(url, options)
    return response
  }

  /**
   * See if the server is running
   */
  async healthCheck(): Promise<string> {
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
  async readAccounts(): Promise<string[]> {
    const command = CashierSync.accountsCommand
    const response = await this.ledger(command)
    if (!response.ok) {
      throw new Error('Error reading accounts!')
    }

    const content = (await response.json()) as string[]

    return content
  }

  /**
   * Retrieve the account balances.
   * @returns array of Account objects
   */
  async readBalances(): Promise<string[]> {
    //const currency = await settings.get(SettingKeys.currency)

    // Get values in the default currency? In case of multi-currency accounts (i.e. expenses).

    const command = 'b --flat --no-total'
    const response = await this.ledger(command)
    const content: string[] = await response.json()

    return content
  }

  /**
   * Get current account values in the base currency.
   * @returns Current account values
   */
  async readCurrentValues(): Promise<string> {
    const rootAcct = await settings.get(SettingKeys.rootInvestmentAccount)
    if (!rootAcct) {
      throw new Error('No root investment account set!')
    }
    const currency = await settings.get(SettingKeys.currency)
    if (!currency) {
      throw new Error('No default currency set!')
    }

    const command = `b ^${rootAcct} -X ${currency} --flat --no-total`

    const response = await this.ledger(command)
    const result: Array<string> = await response.json()

    // parse
    const currentValues = this.parseCurrentValues(result, rootAcct)

    await engine.importCurrentValuesJson(currentValues)
    return 'OK'
  }

  parseCurrentValues(
    lines: Array<string>,
    rootAccount: string
  ): Record<string, string> {
    let result: Record<string, string> = {}

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

  async readLots(symbol: string) {
    const command = `b ^Assets and invest and :${symbol}$ --lots --no-total --collapse`

    //const response = await ky.get(url)
    const response = await this.ledger(command)
    if (!response.ok) throw new Error('error fetching lots: ' + response.text())

    const result: string[] = await response.json()

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
   * Retrieve the list of Payees
   * @returns array of Payee objects
   */
  async readPayees(): Promise<string[]> {
    // Limit the payees to the last 5 years, otherwise there's a high risk of crashing.
    // This command is somehow very memory hungry on Android.
    let year_str = moment().format('YYYY')
    let year = Number(year_str)
    let begin = year - 5

    const command = CashierSync.payeesCommand + ' -b ' + begin
    const response = await this.ledger(command, { timeout: 20000 })
    if (!response.ok) {
      throw new Error('Error reading payees!')
    }

    const content = (await response.json()) as string[]

    return content
  }

  async search(searchParams: object) {
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

  async xact(parameters: object) {
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
