/**
 * Demo data generator.
 */
import { Payee } from 'src/model'
import CashierDAL from '../store/dal'

const dal = new CashierDAL()

async function createDemoPayees() {
  const payeeNames = ['Investment Fund', 'My Bank', 'Salary', 'Supermarket']

  // create objects
  const payees = payeeNames.map((name) => new Payee(name))

  dal.addPayees(payees)
}

export { createDemoPayees }
