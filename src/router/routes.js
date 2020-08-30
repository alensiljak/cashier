/*
  Routes
*/

const routes = [
  {
    path: '/',
    component: () => import('../layouts/Qlayout'),
    children: [
      // { path: '', component: () => import('pages/Index.vue') }
      { path: '', name: 'root', redirect: '/journal' },
      { path: '/about', name: 'about', component: () => import(/* webpackChunkName: 'about' */ '../pages/About.vue') },
      { path: '/account/:id', name: 'account', component: () => import(/* webpackChunkName: 'account' */ '../pages/Account.vue') },
      { path: '/accounts', name: 'accounts', component: () => import(/* webpackChunkName: 'accounts' */ '../pages/Accounts.vue') },
      { path: '/assetallocation', name: 'assetallocation', component: () => import(/* webpackChunkName: 'assetallocation' */ '../pages/AssetAllocation.vue') },
      { path: '/assetallocationhelp', name: 'assetallocationhelp', component: () => import('../pages/AssetAllocationHelp') },
      // { path: '/assetallocationsetup', name: 'assetallocationsetup', component: () => import('../pages/AASetup.vue') },
      { path: '/assetallocationsetuphelp', name: 'assetallocationsetuphelp', component: () => import('../pages/AASetupHelp.vue') },
      { path: '/assetclassdetail/:fullname?', name: 'assetclassdetail', component: () => import('../pages/AssetClassDetail.vue') },
      { path: '/bal', name: 'balanceSheet', component: () => import(/* webpackChunkName: 'bal' */ '../pages/QBalanceSheet.vue') },
      { path: '/cards', name: 'cards', component: () => import(/* webpackChunkName: 'cards' */ '../pages/Cards.vue')},
      { path: '/commodities', name: 'commodities', component: () => import('../pages/Commodities.vue') },
      { path: '/export', name: 'export', component: () => import('../pages/Export.vue') },
      { path: '/favourites', name: 'favourites', component: () => import('../pages/Favourites.vue') },
      { path: '/favouritesreorder', name: 'favreorder', component: () => import('../pages/FavouritesReorder') },
      { path: '/import', name: 'import', component: () => import('../pages/Import.vue') },
      { path: '/journal', name: 'journal', component: () => import('../pages/Journal.vue') },
      { path: '/lots/:symbol', name: 'lots', component: () => import('../pages/Lots.vue') },
      { path: '/payees', name: 'payees', component: () => import('../pages/Payees.vue') },
      { path: '/prices', name: 'prices', component: () => import('../pages/Prices') },
      { path: '/repository', name: 'repository', component: () => import('../pages/Repository') },
      { path: '/reg/:name', name: 'register', component: () => import('../pages/Register.vue') },
      { path: '/settings', name: 'settings', component: () => import('../pages/QSettings.vue') },
      { path: '/sync', name: 'sync', component: () => import('../pages/Sync.vue') },
      { path: '/tx/:id?', name: 'tx', component: () => import(/* webpackChunkName: 'tx' */ '../pages/QTransaction.vue') },
      { path: '/tx-search', name: 'tx-search', component: () => import('../pages/TxSearch.vue') },
      // Test
      // { path: '/webdav', name: 'webdav', component: webdav },
      { path: '/pcloud', name: 'pcloud', component: () => import('../pages/Pcloud.vue') }
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
