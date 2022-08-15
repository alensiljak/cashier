import moment from 'moment'
import { settings, SettingKeys } from './Configuration'
import { LedgerApi } from './ledgerApi'
import { LedgerOutputParser } from './ledgerOutputParser'

const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Security Analysis for symbols.
 * Calculates yield, etc.
 */
export class SecurityAnalysis {
  currency
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
  async getSecurityAnalysisFor(symbol) {
    this.currency = await settings.get(SettingKeys.currency)

    var result = {
      yield: await this.#getYield(symbol),
      gainloss: await this.#getGainLoss(),
    }

    return result
  }

  /**
   * Calculate the yield in the last 12 months.
   * This value is affected by the recent purchases, which result in seemingly lower yield!
   */
  async #getYield(symbol) {
    // Retrieve income amount.
    let incomeStr = await this.#getIncomeBalance(symbol)
    let income = Number(incomeStr)
    // turn into a positive number
    income = income * -1

    // Retrieve the current value of the holding.
    let valueStr = await this.#getValueBalance(symbol, this.currency)
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

  async #getGainLoss() {}

  /**
   * Get the income in the last year.
   */
  async #getIncomeBalance(symbol) {
    const currency = this.currency
    const yieldFrom = moment().subtract(1, 'year').format(DATE_FORMAT)

    const command = `b ^Income and :${symbol}$ -b ${yieldFrom} --flat -X ${currency}`
    const api = this.ledgerApi
    await api.init()
    let report = await api.query(command)

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
    totalNumeric = totalNumeric.replace(',', '')

    return totalNumeric
  }

  async #getValueBalance(symbol, currency) {
    const command = `b ^Assets and :${symbol}$ -X ${currency}`
    const api = this.ledgerApi

    await api.init()
    const report = await api.query(command)
    const total = this.#extractTotal(report)
    return total
  }
}
