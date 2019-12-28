/*
  App router.

  Route level code-splitting:
  'import' generates a separate chunk (about.[hash].js) for this route
  which is lazy-loaded when the route is visited.
  Using webpackChunkName: 'qhome' names the chunk explicitly.

  optional id parameter with '?' -> :id?
*/
import Vue from 'vue'
import Router from 'vue-router'

// manual layout
// import BootstrapLayout from './layouts/Bootstrap'
// The new layout based on Quasar
// import QuasarLayout from './layouts/Qlayout'

Vue.use(Router);

// Bootstrap version remains
// const BHome = () => import(/* webpackChunkName: 'home' */ './views/Home.vue')
// import BSettings from './views/Settings.vue'
// import BTransaction from './views/Transaction.vue'

// Quasar version
// const About = () => import(/* webpackChunkName: 'about' */ './pages/About.vue')
// const Account = () => import(/* webpackChunkName: 'account' */ './pages/Account.vue')
const Accounts = () => import(/* webpackChunkName: 'accounts' */ './pages/Accounts.vue')
const AssetAllocation = () => import(/* webpackChunkName: 'assetallocation' */ './pages/AssetAllocation.vue')
const AssetAllocationHelp = () => import('./pages/AssetAllocationHelp')
const AssetAllocationSetup = () => import('./pages/AASetup.vue')
const AssetAllocationSetupHelp = () => import('./pages/AASetupHelp.vue')
const AssetClassDetail = () => import('./pages/AssetClassDetail.vue')
const QBalanceSheet = () => import(/* webpackChunkName: 'bal' */ './pages/QBalanceSheet.vue')
const Commodities = () => import('./pages/Commodities.vue')
const Export = () => import('./pages/Export.vue')
const Favourites = () => import('./pages/Favourites.vue')
// const FavouritesReorder = () => import('./pages/FavouritesReorder')
const Import = () => import('./pages/Import.vue')
const PayeeList = () => import('./pages/Payees.vue')
const Pcloud = () => import('./pages/Pcloud.vue')
const Prices = () => import('./pages/Prices')
const Journal = () => import('./pages/Journal.vue')
const QSettings = () => import('./pages/QSettings.vue')
const Register = () => import('./pages/Register.vue')
const Sync = () => import('./pages/Sync.vue')
const QTransaction = () => import(/* webpackChunkName: 'tx' */ './pages/QTransaction.vue')
// const webdav = () => import('./pages/WebDAV')

const routes = [
  {
    path: '/',
    component: () => import('./layouts/Qlayout.vue'),
    children: [
      { path: '', name: 'root', redirect: '/favourites' },
      { path: '/about', name: 'about', component: () => import(/* webpackChunkName: 'about' */ './pages/About.vue') },
      { path: '/account/:id', name: 'account', component: () => import(/* webpackChunkName: 'account' */ './pages/Account.vue') },
      { path: '/accounts', name: 'accounts', component: Accounts },
      { path: '/assetallocation', name: 'assetallocation', component: AssetAllocation },
      { path: '/assetallocationhelp', name: 'assetallocationhelp', component: AssetAllocationHelp },
      { path: '/assetallocationsetup', name: 'assetallocationsetup', component: AssetAllocationSetup },
      { path: '/assetallocationsetuphelp', name: 'assetallocationsetuphelp', component: AssetAllocationSetupHelp },
      { path: '/assetclassdetail/:fullname?', name: 'assetclassdetail', component: AssetClassDetail },
      { path: '/bal', name: 'balanceSheet', component: QBalanceSheet },
      { path: '/commodities', name: 'commodities', component: Commodities },
      { path: '/export', name: 'export', component: Export },
      { path: '/favourites', name: 'favourites', component: Favourites },
      { path: '/favouritesreorder', name: 'favreorder', component: () => import('./pages/FavouritesReorder') },
      { path: '/import', name: 'import', component: Import },
      { path: '/payees', name: 'payees', component: PayeeList },
      { path: '/prices', name: 'prices', component: Prices },
      { path: '/journal', name: 'journal', component: Journal },
      { path: '/reg/:name', name: 'register', component: Register },
      { path: '/settings', name: 'settings', component: QSettings },
      { path: '/sync', name: 'sync', component: Sync },
      { path: '/tx/:id?', name: 'tx', component: QTransaction },
      // Test
      // { path: '/webdav', name: 'webdav', component: webdav },
      { path: '/pcloud', name: 'pcloud', component: Pcloud }
    ]
  },
  // {
  //   path: '/b',
  //   component: BootstrapLayout,
  //   children: [
  //     //{ path: '/', name: 'home', component: Home },
  //     {
  //       path: '',
  //       // name: 'home',
  //       component: BHome
  //     },
  //     //{ path: '/payee/:name', component: PayeeList, props: true },
  //     { path: '/bsettings', component: BSettings },
  //     { path: '/btx', component: BTransaction },
  //   ]
  // },
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
