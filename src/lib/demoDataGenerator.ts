/**
 * Demo data generator.
 */
import { Account, Payee } from 'src/model'
import CashierDAL from '../store/dal'
import { engine as assetAllocationEngine } from './AssetAllocation'

const dal = new CashierDAL()

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

export { createAccountBalances, createAssetAllocation, createPayees }
