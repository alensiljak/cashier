/**
 * The service which handles the Accounts data.
 * It should simply use the cached versions of API requests,
 * and parse them when needed.
 * No other local storage is used.
 */
import { Account, AccountBalance } from 'src/model'
import db from 'src/store/indexedDb'
import { SettingKeys, settings, Constants } from './settings'
import { CashierSync } from './syncCashier'

export class AccountService {
  constructor() {}

  async createDefaultAccounts() {
    let accountsList = this.getDefaultChartOfAccounts()
    let accountNames = accountsList.split('\n')
    // trim
    accountNames = accountNames.map((account) => account.trim())
    accountNames = accountNames.filter((account) => account)

    // create objects
    // const accounts = accountNames.map((accountName) => new Account(accountName))
    const accounts = accountNames.map((accountName) => {
      return {
        name: accountName,
      }
    })
    await db.accounts.bulkAdd(accounts)
  }

  getAccountBalance(account: Account, defaultCurrency: string): AccountBalance {
    if (!defaultCurrency) {
      throw new Error('Default currency is mandatory!')
    }

    let result = new AccountBalance()
    // const defaultCurrency = await settings.get(SettingKeys.currency)

    // default value
    result.amount = 0
    result.currency = defaultCurrency

    // Are there any balance records?
    if (!account.balances) return result

    // Do we have a balance in the default currency?
    let balance = account.balances[defaultCurrency]
    if (balance) {
      result.amount = balance
      result.currency = defaultCurrency
      return result
    }

    // Otherwise take the first balance/currency.
    const currencies = Object.keys(account.balances)
    if (!currencies) return result

    const currency = currencies[0]
    result.amount = account.balances[currency]
    result.currency = currency
    return result
  }

  // async getAccountsFromCache() {
  //   // This version simply retrieves the cached version of /accounts response.
  //   const serverUrl = await settings.get(SettingKeys.syncServerUrl)
  //   const cashierSync = new CashierSync(serverUrl)
  //   const cache = await caches.open(Constants.CacheName)
  //   const accountsResponse = await cache.match(cashierSync.getAccountsUrl())
  //   if (!accountsResponse) {
  //     throw new Error('Accounts not cached!')
  //   }
  //   const accounts = await accountsResponse.json()
  //   // they should be already sorted by name.
  //   console.debug(accounts)
  // }

  getDefaultChartOfAccounts() {
    const accountsList = `
    Assets:Cash
    Assets:Bank Accounts:Checking
    Assets:Bank Accounts:Savings
    Assets:Fixed Assets
    Assets:Investments:Cash
    Assets:Investments:Stocks
    Assets:Retirement
    Equity:Opening Balances
    Expenses:Auto:Accessories
    Expenses:Auto:Auto Insurance
    Expenses:Auto:Car Wash
    Expenses:Auto:Fuel
    Expenses:Auto:Parking
    Expenses:Auto:Registration
    Expenses:Auto:Service
    Expenses:Auto:Tickets
    Expenses:Auto:Toll
    Expenses:Auto:Tyres
    Expenses:Charity
    Expenses:Clothing:Clothes
    Expenses:Clothing:Footwear
    Expenses:Commissions
    Expenses:Culture:Books
    Expenses:Culture:Cinema
    Expenses:Culture:Museums
    Expenses:Culture:Music
    Expenses:Culture:Photo
    Expenses:Culture:Printing
    Expenses:Culture:Sightseeing
    Expenses:Culture:Stationary
    Expenses:Education
    Expenses:Financial:Bank Charge
    Expenses:Financial:Interest
    Expenses:Food
    Expenses:Gifts Given
    Expenses:Health:Dental
    Expenses:Health:Diagnostics
    Expenses:Health:Doctor
    Expenses:Health:Medicines
    Expenses:Health:Optical
    Expenses:Health:Products
    Expenses:Home:Appliances
    Expenses:Home:Furniture
    Expenses:Home:Maintenance
    Expenses:Home:Repairs
    Expenses:Home:Furnishing
    Expenses:Home:Tools
    Expenses:Home:Utensils
    Expenses:Hospitality:Accommodation
    Expenses:Hospitality:Dining
    Expenses:Hospitality:Drinks
    Expenses:Housing:Building Maintenance
    Expenses:Housing:Electricity
    Expenses:Housing:Gas
    Expenses:Housing:Mortgage Fees
    Expenses:Housing:Property Tax
    Expenses:Housing:Gas Service
    Expenses:InfoComm:Electronics
    Expenses:InfoComm:Hardware
    Expenses:InfoComm:Internet
    Expenses:InfoComm:Mobile Services
    Expenses:InfoComm:Phone
    Expenses:InfoComm:Services
    Expenses:InfoComm:Service Fees
    Expenses:InfoComm:Software
    Expenses:Insurance:Health Insurance
    Expenses:Insurance:Life Insurance
    Expenses:Personal:Care
    Expenses:Personal:Hairdressing
    Expenses:Personal:Other
    Expenses:Recreation:Activities
    Expenses:Recreation:Durables
    Expenses:Recreation:Games
    Expenses:Recreation:Rides
    Expenses:Tax:Federal
    Expenses:Transport:Bus
    Expenses:Transport:Flights
    Expenses:Transport:Post
    Expenses:Transport:Public
    Expenses:Transport:Taxi
    Expenses:Transport:Train
    Expenses:Vacation:Package
    Income:Interest
    Income:Investments
    Income:Salary
    Income:Other
    Liabilities:Credit Cards
    Liabilities:Loans
    `
    return accountsList
  }
}
