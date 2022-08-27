import { defineStore } from 'pinia'
import appService from '../appService'
import { ScheduledTransaction, Transaction } from 'src/model'
import { isNumber } from 'mathjs'

export const useMainStore = defineStore('mainStore', {
  /**
   * Initial state.
   * data
   * @returns state
   */
  state: () => ({
    /**
     * Indicates whether the sidebar is open or not.
     */
    drawerOpen: false,
    /**
     * Scheduled transaction being edited.
     */
    scheduledTx: null,
    /**
     * Transaction being edited.
     */
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
      console.debug('mainStore: loading tx', id, '; id type', typeof id)

      if (!isNumber(id)) {
        id = Number(id)
      }

      const tx = await appService.loadTransaction(id)
      this.setTransaction(tx)
    },
    newScheduledTx() {
      let newSchTx = new ScheduledTransaction()
      this.scheduledTx = newSchTx
    },
    newTx() {
      const tx = Transaction.create()
      this.setTransaction(tx)
    },
    setDrawerOpen(isOpen) {
      this.drawerOpen = isOpen
    },
    setTransaction(tx) {
      if (this.tx) {
        Object.assign(this.tx, tx)
        //this.tx.$patch(tx)
      } else {
        this.tx = tx
      }
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },
  },
})
