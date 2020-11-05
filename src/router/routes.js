/*
  Routes
*/

const routes = [
  {
    path: '/',
    component: () => import('../layouts/Qlayout'),
    children: [
      { path: '', name: 'root', redirect: '/home' },
      { path: '/about', name: 'about', component: () => import(/* webpackChunkName: 'about' */ '../pages/About.vue') },
      { path: '/account/:id', name: 'account', component: () => import(/* webpackChunkName: 'account' */ '../pages/Account.vue') },
      { path: '/accounts', name: 'accounts', component: () => import(/* webpackChunkName: 'accounts' */ '../pages/Accounts.vue') },
      { path: '/assetallocation', name: 'assetallocation', component: () => import(/* webpackChunkName: 'assetallocation' */ '../pages/AssetAllocation.vue') },
      { path: '/assetallocationhelp', name: 'assetallocationhelp', component: () => import('../pages/AssetAllocationHelp') },
      { path: '/assetallocationsetuphelp', name: 'assetallocationsetuphelp', component: () => import('../pages/AASetupHelp.vue') },
      { path: '/assetclassdetail/:fullname?', name: 'assetclassdetail', component: () => import('../pages/AssetClassDetail.vue') },
      { path: '/bal', name: 'balanceSheet', component: () => import(/* webpackChunkName: 'bal' */ '../pages/QBalanceSheet.vue') },
      { path: '/cache', name: 'cache', component: () => import(/* webpackChunkName: 'cache' */ '../pages/Cache.vue')},
      { path: '/commodities', name: 'commodities', component: () => import(/* webpackChunkName: 'commodities' */'../pages/Commodities.vue') },
      { path: '/export', name: 'export', component: () => import('../pages/Export.vue') },
      { path: '/favourites', name: 'favourites', component: () => import('../pages/Favourites.vue') },
      { path: '/favouritesreorder', name: 'favreorder', component: () => import(/* webpackChunkName: 'favreorder' */'../pages/FavouritesReorder') },
      { path: '/home', name: 'home', component: () => import('../pages/Home.vue') },
      { path: '/journal', name: 'journal', component: () => import('../pages/Journal.vue') },
      { path: '/lots/:symbol', name: 'lots', component: () => import(/* webpackChunkName: 'lots' */ '../pages/Lots.vue') },
      { path: '/payees', name: 'payees', component: () => import('../pages/Payees.vue') },
      { path: '/prices', name: 'prices', component: () => import(/* webpackChunkName: 'prices' */ '../pages/Prices') },
      { path: '/reg/:name', name: 'register', component: () => import(/* webpackChunkName: 'register' */ '../pages/Register.vue') },
      { path: '/settings', name: 'settings', component: () => import('../pages/Settings.vue') },
      { path: '/scheduledtransactions', name: 'scheduledtransactions', component: () => import(/* webpackChunkName: 'scheduledtransactions' */'../pages/ScheduledTransactions.vue') },
      { path: '/scheduledtxeditor', name: 'scheduledtxeditor', component: () => import(/* webpackChunkName: 'scheduledtxeditor' */'../pages/ScheduledTxEditor.vue') },
      { path: '/sync', name: 'sync', component: () => import('../pages/Sync.vue') },
      { path: '/newtx', name: 'newtx', component: () => import('../pages/Transaction.vue') },
      { path: '/edittx/:id', name: 'edittx', component: () => import('../pages/Transaction.vue') },
      { path: '/tx-search', name: 'tx-search', component: () => import(/* webpackChunkName: 'txsearch' */'../pages/TxSearch.vue') },
      { path: '/xact', name: 'xact', component: () => import(/* webpackChunkName: 'xact' */'../pages/Xact.vue') },
      { path: '/pcloud', name: 'pcloud', component: () => import(/* webpackChunkName: 'pcloud' */'../pages/Pcloud.vue') }
    ]
  },
  {
    // path: '/index.html',
    path: '*',
    redirect: '/'
  }
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes
