import { defineStore } from 'pinia'
import appService from '../appService'
import { ScheduledTransaction, Transaction } from 'src/model'
import { isNumber } from 'mathjs'

interface IState {
  drawerOpen: boolean
  scheduledTx: ScheduledTransaction | null
  tx: Transaction | null
}

const myState: IState = {
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
}

export const useMainStore = defineStore('mainStore', {
  /**
   * Initial state.
   * data
   * @returns state
   */
  state: () => myState,

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
    async loadScheduledTx(id: number) {
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
      let tx = schTx.transaction
      this.setTransaction(tx)

      return schTx
    },
    async loadTx(id: number) {
      //console.debug('mainStore: loading tx', id, '; id type', typeof id)

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
    setDrawerOpen(isOpen: boolean) {
      this.drawerOpen = isOpen
    },
    setTransaction(tx: Transaction | null) {
      // if (this.tx) {
      //   //Object.assign(this.tx, tx)
      //   //this.tx.$patch(tx)
      //   this.$patch({ tx: tx })
      // } else {
      //   this.tx = tx
      // }
      this.tx = tx
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },
  },
})
