/*
  App router.
*/
import Vue from 'vue'
import Router from 'vue-router'

// about is lazy-loaded
//import About from './views/About.vue'
//import Home from './views/Home.vue'
//const Home = () => import('./Home.vue')
import PayeeList from './views/Payees.vue'
import Register from './views/Register.vue'
import Settings from './views/Settings.vue'
import Transaction from './views/Transaction.vue'
import DataTest from './views/DataTest.vue'
// manual layout
import BootstrapLayout from './layouts/Bootstrap'
// Quasar layout
import DefaultLayout from './layouts/Default.vue'
// The new layout
import MyQuasarLayout from './layouts/Qlayout'
const QAbout = () => import('./views/QAbout.vue')
const QTransaction = () => import('./views/QTransaction.vue')
const QBalanceSheet = () => import('./views/QBalanceSheet.vue')
const QRegister = () => import('./views/QRegister.vue')
const QSettings = () => import('./views/QSettings.vue')
const Sync = () => import('./views/Sync.vue')


Vue.use(Router);

const routes = [
  {
    path: '/',
    component: MyQuasarLayout,
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
        // name: 'about',
        component: QAbout
      },
      {
        path: '/bal',
        name: 'balanceSheet',
        component: QBalanceSheet
      },
      {
        path: '/reg',
        name: 'register',
        component: QRegister
      },
      { path: '/settings', component: QSettings },
      { path: '/sync', name: "sync", component: Sync },
      {
        path: '/tx',
        name: 'newTransaction',
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
        path: '/about',
        // name: 'about',
        component: () =>
          import(/* webpackChunkName: 'about' */ './views/About.vue')
      },
      //{ path: '/payee/:name', component: PayeeList, props: true },
      { path: '/payees', component: PayeeList },
      { path: '/reg', component: Register },
      { path: '/settings', component: Settings },
      { path: '/tx', component: Transaction },
      // todo remove after testing
      { path: '/data', component: DataTest }
    ]
  },
  {
    path: '/q',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () =>
          import(/* webpackChunkName: 'home' */ './views/QHome.vue')
      }
    ]
  },
  // catch-all, to fix the offline PWA blank-screen issue.
  // { path: '/index.html', component: Home, alias: '/' },
  // {
  //   path: '/index.html',
  //   alias: '/',
  //   component: () => import(/* webpackChunkName: 'home' */ './views/Home.vue')
  // }
  // trying with a simple redirect
  {
    path: '/index.html',
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
