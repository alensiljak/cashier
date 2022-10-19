import moment from 'moment'
import { settings, SettingKeys } from './settings'
import { LedgerApi } from './ledgerApi'
import { LedgerOutputParser } from './ledgerOutputParser'

const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Security Analysis for symbols.
 * Calculates yield, etc.
 */

export interface SecurityAnalysis {
  yield: any
  gainloss: any
}

export class SecurityAnalyser {
  currency: string | undefined
  ledgerApi

  constructor() {
    // symbol, currency
    // this.symbol = symbol
    //this.currency = null
    this.ledgerApi = new LedgerApi()
  }

  /**
   * Performs the Security Analysis with Ledger data.
   * @param {string} symbol
   */
  async getSecurityAnalysisFor(symbol: string): Promise<SecurityAnalysis> {
    let currency = await settings.get(SettingKeys.currency)
    this.currency = currency
    await this.ledgerApi.init()

    let result: SecurityAnalysis = {
      yield: await this.#getYield(symbol, currency),
      gainloss: await this.#getGainLoss(symbol, currency),
      //basis: await this.#getBasis(symbol, currency),
    }

    return result
  }

  /**
   * Used temporarily only to check the base amount. It mostly fits the gain/loss plus
   * the balance in base currency (not always!).
   * @param symbol
   * @param currency
   * @returns
   */
  async #getBasis(symbol: string, currency: string) {
    const command = `b ^Assets and :${symbol}$ -B -n -X ${currency}`
    const report = await this.ledgerApi.query(command)

    return report
  }

  /**
   * Calculate the yield in the last 12 months.
   * This value is affected by the recent purchases, which result in seemingly lower yield!
   */
  async #getYield(symbol: string, currency: string) {
    // Retrieve income amount.
    let incomeStr = await this.#getIncomeBalance(symbol)
    let income = Number(incomeStr)
    // turn into a positive number
    income = income * -1

    // Retrieve the current value of the holding.
    let valueStr = await this.#getValueBalance(symbol, currency)
    let value = Number(valueStr)

    // Calculate
    let _yield = null
    if (value == 0.0) {
      _yield = 0.0
    } else {
      _yield = (income * 100) / value
    }

    //console.debug('income:', income, 'value:', value, 'yield:', _yield)

    const result = _yield.toFixed(2) + '%'

    return result
  }

  async #getGainLoss(symbol: string, currency: string) {
    const command = `b ^Assets and :${symbol}$ -G -n -X ${currency}`
    const report = await this.ledgerApi.query(command)
    const line = report[0]

    let number = this.#getNumberFromCollapseResult(line)
    const result = number + ' ' + this.currency

    // calculate the percentage

    return result
  }

  /**
   * Get the income in the last year.
   */
  async #getIncomeBalance(symbol: string) {
    const currency = this.currency
    const yieldFrom = moment().subtract(1, 'year').format(DATE_FORMAT)

    const command = `b ^Income and :${symbol}$ -b ${yieldFrom} --flat -X ${currency}`
    let report = await this.ledgerApi.query(command)

    const total = this.#extractTotal(report)
    return total
  }

  /**
   * Extracts the Total value from a ledger response.
   * @param {Array} ledgerReport
   */
  #extractTotal(ledgerReport) {
    if (ledgerReport.length == 0) {
      return 0
    }

    //let line = ledgerReport[0]
    const parser = new LedgerOutputParser()
    const totalLines = parser.getTotalLines(ledgerReport)
    let totalLine = totalLines[0]

    // Gets the numeric value of the total from the ledger total line
    totalLine = totalLine.trim()
    const parts = totalLine.split(' ')
    let totalNumeric = parts[0]
    // remove thousand-separators
    totalNumeric = totalNumeric.replaceAll(',', '')

    return totalNumeric
  }

  async #getValueBalance(symbol: string, currency: string) {
    const command = `b ^Assets and :${symbol}$ -X ${currency}`
    const api = this.ledgerApi

    await api.init()
    const report = await api.query(command)
    const total = this.#extractTotal(report)
    return total
  }

  /**
   * Parses a 1-line ledger result, when --collapse is used
   * @param {String} line
   */
  #getNumberFromCollapseResult(line) {
    line = line.trim()

    // -1,139 EUR  Assets
    const parts = line.split(' ')
    if (parts.length != 4) {
      throw new Error('wrong number of parts!')
    }

    let totalNumeric = parts[0]
    totalNumeric = totalNumeric.replaceAll(',', '')
    return totalNumeric
  }
}
