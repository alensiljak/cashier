import { defineStore } from 'pinia'
import appService from '../appService'
import { ScheduledTransaction, Transaction } from 'src/model'

export const useMainStore = defineStore('mainStore', {
  /**
   * Initial state.
   * data
   * @returns state
   */
  state: () => ({
    scheduledTx: null,
    tx: null,
  }),

  /**
   * computed
   */
  getters: {
    myItem: (state) => state.tx,
  },

  /**
   * methods
   * Can be asynchronous.
   */
  actions: {
    async loadScheduledTx(id) {
      console.debug('loading schtx', id, 'id type', typeof id)

      if (typeof id === 'string') {
        id = Number(id)
      }

      let schTx = await appService.db.scheduled.get(id)
      if (!schTx) {
        throw new Error('Scheduled transaction not found!', id)
      }

      this.scheduledTx = schTx

      // transaction
      let tx = JSON.parse(schTx.transaction)
      this.setTransaction(tx)

      return schTx
    },
    async loadTx(id) {
      console.debug('loading tx', id, 'id type', typeof id)

      const tx = await appService.loadTransaction(id)
      this.setTransaction(tx)
    },
    newScheduledTx() {
      let newSchTx = new ScheduledTransaction()
      this.scheduledTx = newSchTx
    },
    newTx() {
      const tx = Transaction.createTransaction()
      this.setTransaction(tx)
    },
    setTransaction(tx) {
      if (this.tx) {
        Object.assign(this.tx, tx)
        //this.tx.$patch(tx)
      } else {
        this.tx = tx
      }
    },
  },
})
