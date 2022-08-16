import { defineStore } from 'pinia'

export const useTxStore = defineStore('txStore', {
  state: () => ({
    tx: {},
  }),
  getters: {},
  actions: {
    setTx(payload) {
      if (this.tx) {
        Object.assign(this.tx, payload)
      } else {
        // new tx
        this.tx = payload
      }
    },
  },
})
