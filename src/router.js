/*
  App router.
*/
import Vue from 'vue'
import Router from 'vue-router'

// about is lazy-loaded
//import About from './views/About.vue'
//import Home from './views/Home.vue'
//const Home = () => import('./Home.vue')
import Settings from './views/Settings.vue'
import Transaction from './views/Transaction.vue'
// manual layout
import BootstrapLayout from './layouts/Bootstrap'
// The new layout based on Quasar
import QuasarLayout from './layouts/Qlayout'

Vue.use(Router);

// const QAbout = () => import('./views/QAbout.vue')
const QTransaction = () => import('./views/QTransaction.vue')
const QBalanceSheet = () => import('./views/QBalanceSheet.vue')
const QRegister = () => import('./views/QRegister.vue')
const QSettings = () => import('./views/QSettings.vue')
const Accounts = () => import('./views/Accounts.vue')
const Sync = () => import('./views/Sync.vue')
import PayeeList from './views/Payees.vue'
const Commodities = () => import('./views/Commodities.vue')

const routes = [
  {
    path: '/',
    component: QuasarLayout,
    children: [
      // {
      //   path: '',
      //   // name: 'qhome',
      //   component: () =>
      //     import(/* webpackChunkName: 'qhome' */ './views/QHome.vue')
      // },
      {
        path: '',
        redirect: '/bal'
      },
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: 'qhome' */ './views/QAbout.vue')
      },
      {
        path: '/accounts',
        name: 'accounts',
        component: Accounts
      },
      {
        path: '/bal',
        name: 'balanceSheet',
        component: QBalanceSheet
      },
      { path: '/commodities', name: 'commodities', component: Commodities },
      { path: '/payees', name: 'payees', component: PayeeList },
      {
        path: '/reg',
        name: 'register',
        component: QRegister
      },
      { path: '/settings', component: QSettings },
      { path: '/sync', name: "sync", component: Sync },
      {
        // optional id parameter.
        path: '/tx/:id?',
        name: 'tx',
        component: QTransaction
      }
    ]
  },
  {
    path: '/b',
    component: BootstrapLayout,
    children: [
      //{ path: '/', name: 'home', component: Home },
      {
        path: '',
        // name: 'home',
        component: () =>
          import(/* webpackChunkName: 'home' */ './views/Home.vue')
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //{ path: '/about', name: 'about', component: About },
      {
        path: '/babout',
        // name: 'about',
        component: () =>
          import(/* webpackChunkName: 'about' */ './views/About.vue')
      },
      //{ path: '/payee/:name', component: PayeeList, props: true },
      { path: '/bsettings', component: Settings },
      { path: '/btx', component: Transaction },
    ]
  },
  // catch-all, to fix the offline PWA blank-screen issue.
  // {
  //   path: '/index.html',
  //   alias: '/',
  //   component: () => import(/* webpackChunkName: 'home' */ './views/Home.vue')
  // }
  // using just a simple redirect to an existing page instead.
  {
    // path: '/index.html',
    path: '*',
    redirect: '/'
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
  hashbang: false
});

export default router;
