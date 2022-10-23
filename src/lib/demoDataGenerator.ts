/**
 * Demo data generator.
 */
import { Account, Payee } from 'src/model'
import CashierDAL from '../store/dal'

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

async function setAccountBalances(
  accountName: string,
  balances: Record<string, number>
) {
  let account = await dal.getAccount(accountName)
  account.balances = balances
  await dal.saveAccount(account)
}

export { createAccountBalances, createPayees }
