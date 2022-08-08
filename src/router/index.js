//import Vue from 'vue'
//import VueRouter from 'vue-router'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

//Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  // const Router = new VueRouter({
  //   scrollBehavior: () => ({ x: 0, y: 0 }),
  //   routes,

  //   // Leave these as they are and change in quasar.conf.js instead!
  //   // quasar.conf.js -> build -> vueRouterMode
  //   // quasar.conf.js -> build -> publicPath
  //   mode: process.env.VUE_ROUTER_MODE,
  //   base: process.env.VUE_ROUTER_BASE
  // })

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  return Router
}
