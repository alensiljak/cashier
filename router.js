/*
  App router.
*/
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import About from './views/About.vue'
import Home from './views/Home.vue'
//const Home = () => import('./Home.vue')
import BalanceSheet from './views/BalanceSheet.vue'
import PayeeList from './views/PayeeList.vue'
import Register from './views/Register.vue'
//const BalanceSheet = () => import('./BalanceSheet.vue')
import Settings from './views/Settings.vue'
import Transaction from './views/Transaction.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/bal', component: BalanceSheet },
  //{ path: '/payee/:name', component: PayeeList, props: true },
  { path: '/payee', component: PayeeList },
  { path: '/reg', component: Register },
  { path: '/settings', component: Settings },
  { path: '/tx', component: Transaction }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  hashbang: false
});

export default router;