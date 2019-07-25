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
import QuasarLayout from './layouts/Qlayout'

Vue.use(Router);

// Bootstrap version remains
// const BHome = () => import(/* webpackChunkName: 'home' */ './views/Home.vue')
// import BSettings from './views/Settings.vue'
// import BTransaction from './views/Transaction.vue'

// Quasar version
const About = () => import(/* webpackChunkName: 'about' */ './views/About.vue')
const Account = () => import(/* webpackChunkName: 'account' */ './views/Account.vue')
const Accounts = () => import(/* webpackChunkName: 'accounts' */ './views/Accounts.vue')
const AssetAllocation = () => import(/* webpackChunkName: 'assetallocation' */ './views/AssetAllocation.vue')
const AssetAllocationHelp = () => import('./views/AssetAllocationHelp')
const AssetAllocationSetup = () => import('./views/AASetup.vue')
const AssetAllocationSetupHelp = () => import('./views/AASetupHelp.vue')
const AssetClassDetail = () => import('./views/AssetClassDetail.vue')
const QBalanceSheet = () => import(/* webpackChunkName: 'bal' */ './views/QBalanceSheet.vue')
const Commodities = () => import('./views/Commodities.vue')
const Export = () => import('./views/Export.vue')
const Favourites = () => import('./views/Favourites.vue')
const FavouritesReorder = () => import('./views/FavouritesReorder')
const Import = () => import('./views/Import.vue')
const PayeeList = () => import('./views/Payees.vue')
const Prices = () => import('./views/Prices')
const Journal = () => import('./views/Journal.vue')
const QSettings = () => import('./views/QSettings.vue')
const Register = () => import('./views/Register.vue')
const Sync = () => import('./views/Sync.vue')
const QTransaction = () => import(/* webpackChunkName: 'tx' */ './views/QTransaction.vue')
// const webdav = () => import('./views/WebDAV')

const routes = [
  {
    path: '/',
    component: QuasarLayout,
    children: [
      { path: '', name: 'root', redirect: '/favourites' },
      { path: '/about', name: 'about', component: About },
      { path: '/account/:id', name: 'account', component: Account },
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
      { path: '/favouritesreorder', name: 'favreorder', component: FavouritesReorder },
      { path: '/import', name: 'import', component: Import },
      { path: '/payees', name: 'payees', component: PayeeList },
      { path: '/prices', name: 'prices', component: Prices },
      { path: '/journal', name: 'journal', component: Journal },
      { path: '/reg/:name', name: 'register', component: Register },
      { path: '/settings', name: 'settings', component: QSettings },
      { path: '/sync', name: 'sync', component: Sync },
      { path: '/tx/:id?', name: 'tx', component: QTransaction },
      // { path: '/webdav', name: 'webdav', component: webdav }
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
