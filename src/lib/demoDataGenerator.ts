/**
 * Demo data generator.
 */
import { Payee, Posting, Transaction } from 'src/model'
import CashierDAL from '../store/dal'
import { AccountService } from './accountsService'
import { engine as assetAllocationEngine } from './AssetAllocation'

const dal = new CashierDAL()

async function createInvestmentAccounts() {
  const investmentAccountNames = `
    Assets:Investments:Stocks:VT
    Assets:Investments:Stocks:BND
    Assets:Investments:Stocks:BNDX
    Assets:Investments:Stocks:VNQ
    Assets:Investments:Stocks:VNQI
    Assets:Investments:Cash USD
    Assets:Investments:Cash AUD
    `

  const acctSvc = new AccountService()
  await acctSvc.createAccounts(investmentAccountNames)
}

async function createPayees() {
  const payeeNames = ['Investment Fund', 'My Bank', 'Salary', 'Supermarket']

  // create objects
  const payees = payeeNames.map((name) => new Payee(name))

  dal.addPayees(payees)
}

async function createAccountBalances() {
  // Assets
  await setAccountBalances('Assets:Cash', { EUR: 100 })

  // Expenses
  await setAccountBalances('Expenses:Hospitality:Dining', {
    BHT: 2500,
    EUR: 256,
    USD: 130,
  })

  // Investments
  await setAccountBalances('Assets:Investments:Cash', { EUR: 1000 })
  await setAccountCurrentValue('Assets:Investments:Cash', { EUR: 1000 })
  await setAccountBalances('Assets:Investments:Cash USD', { USD: 486.5 })
  await setAccountCurrentValue('Assets:Investments:Cash USD', { EUR: 500 })
  await setAccountBalances('Assets:Investments:Cash AUD', { AUD: 782 })
  await setAccountCurrentValue('Assets:Investments:Cash AUD', { EUR: 500 })
  //
  await setAccountCurrentValue('Assets:Investments:Stocks', { EUR: 0 })
  // Stocks
  await setAccountBalances('Assets:Investments:Stocks:VT', { VT: 12 })
  await setAccountCurrentValue('Assets:Investments:Stocks:VT', { EUR: 983.52 })
  // Bonds
  await setAccountBalances('Assets:Investments:Stocks:BND', { BND: 10 })
  await setAccountCurrentValue('Assets:Investments:Stocks:BND', { EUR: 695 })
  await setAccountBalances('Assets:Investments:Stocks:BNDX', { BNDX: 10 })
  await setAccountCurrentValue('Assets:Investments:Stocks:BNDX', { EUR: 470.8 })
  // Real-Estate
  await setAccountBalances('Assets:Investments:Stocks:VNQ', { VNQ: 10 })
  await setAccountCurrentValue('Assets:Investments:Stocks:VNQ', { EUR: 781.5 })
  await setAccountBalances('Assets:Investments:Stocks:VNQI', { VNQI: 10 })
  await setAccountCurrentValue('Assets:Investments:Stocks:VNQI', { EUR: 374.6 })
}

async function createAssetAllocation() {
  let tomlDefinition = `
  [Allocation]
  allocation = 100

  [Allocation.Equity]
  allocation = 55
  symbols = ["VT"]

  [Allocation.Fixed]
  allocation = 30
  symbols = ["BND", "BNDX"]

  [Allocation.Real]
  allocation = 12
  symbols = ["VNQ", "VNQI"]

  [Allocation.Cash]
  allocation = 3
  symbols = ["EUR", "USD", "AUD", "GBP"]
  `

  await assetAllocationEngine.importTomlDefinition(tomlDefinition)
}

async function setAccountBalances(
  accountName: string,
  balances: Record<string, number>
) {
  let account = await dal.getAccount(accountName)
  account.balances = balances
  await dal.saveAccount(account)
}

async function setAccountCurrentValue(
  accountName: string,
  currentBalance: Record<string, number>
) {
  let account = await dal.getAccount(accountName)
  const keys = Object.keys(currentBalance)
  const currency = keys[0]

  account.currentValue = currentBalance[currency]
  account.currentCurrency = currency

  await dal.saveAccount(account)
}

async function createTransactions() {
  // create dummy transaction
  let tx = new Transaction()
  tx.date = '2023-03-01'
  tx.payee = 'Supermarket'
  tx.note = 'Test transaction'

  let p1 = new Posting()
  p1.account = 'Expenses:Food'
  p1.amount = 20
  p1.currency = 'EUR'
  tx.postings.push(p1)

  let p2 = new Posting()
  p2.account = 'Assets:Cash'
  //p2.amount = -20;
  //p2.currency = 'EUR';
  tx.postings.push(p2)

  await dal.saveTransaction(tx)

  // loan payment
  tx = createLoanPayment()
  await dal.saveTransaction(tx)
}

function createLoanPayment(): Transaction {
  let tx = new Transaction()
  tx.date = '2023-02-01'
  tx.payee = 'My Bank'

  let p1 = new Posting()
  p1.account = 'Liabilities:Loans'
  p1.amount = 250
  p1.currency = 'EUR'
  tx.postings.push(p1)

  let p2 = new Posting()
  p2.account = 'Assets:Bank Accounts:Checking'
  tx.postings.push(p2)

  return tx
}

export {
  createAccountBalances,
  createAssetAllocation,
  createInvestmentAccounts,
  createPayees,
  createTransactions,
}
