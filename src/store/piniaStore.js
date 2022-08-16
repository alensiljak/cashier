import { defineStore } from 'pinia'

export const usePiniaStore = defineStore({
  id: 'mainStore',

  /**
   * Initial state.
   * data
   * @returns state
   */
  state: () => ({
    item: 'something',
  }),

  /**
   * computed
   */
  getters: {
    myItem: (state) => state.item,
  },

  /**
   * methods
   * Can be asynchronous.
   */
  actions: {
    modify() {
      this.item = 'something else'
    },
  },
})
