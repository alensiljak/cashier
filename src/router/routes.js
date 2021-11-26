/*
  Routes
*/

// components
const CalculatorNeu = () => import('../pages/Calculator.vue')

const routes = [
  {
    path: '/',
    component: () => import('../layouts/Qlayout'),
    children: [
      { path: '', name: 'root', redirect: '/home' },
      {
        path: '/about',
        name: 'about',
        component: () =>
          import('../pages/About.vue')
      },
      {
        path: '/account/:id',
        name: 'account',
        component: () =>
          import(/* webpackChunkName: 'account' */ '../pages/Account.vue')
      },
      {
        path: '/accounts',
        name: 'accounts',
        component: () =>
          import('../pages/Accounts.vue')
      },
      {
        path: '/assetallocation',
        name: 'assetallocation',
        component: () =>
          import(
            /* webpackChunkName: 'assetallocation' */ '../pages/AssetAllocation.vue'
          )
      },
      {
        path: '/assetallocationhelp',
        name: 'assetallocationhelp',
        component: () => import(/* webpackChunkName: 'assetallocation' */ '../pages/AssetAllocationHelp')
      },
      {
        path: '/assetallocationsetuphelp',
        name: 'assetallocationsetuphelp',
        component: () => import(/* webpackChunkName: 'assetallocation' */ '../pages/AASetupHelp.vue')
      },
      {
        path: '/assetclassdetail/:fullname?',
        name: 'assetclassdetail',
        component: () => import(/* webpackChunkName: 'assetallocation' */ '../pages/AssetClassDetail.vue')
      },
      {
        path: '/bal',
        name: 'balanceSheet',
        component: () =>
          import(/* webpackChunkName: 'bal' */ '../pages/QBalanceSheet.vue')
      },
      {
        path: '/cache',
        name: 'cache',
        component: () =>
          import(/* webpackChunkName: 'cache' */ '../pages/Cache.vue')
      },
      {
        path: '/calculator',
        components: {
          default: CalculatorNeu
        }
      },
      {
        path: '/calendar',
        name: 'calendar',
        component: () =>
          import(/* webpackChunkName: 'calendar' */ '../pages/Calendar.vue')
      },
      {
        path: '/commodities',
        name: 'commodities',
        component: () =>
          import(
            /* webpackChunkName: 'commodities' */ '../pages/Commodities.vue'
          )
      },
      {
        path: '/export/:type?',
        name: 'export',
        component: () => import('../pages/Export.vue')
      },
      {
        path: '/favourites',
        name: 'favourites',
        component: () => import('../pages/Favourites.vue')
      },
      {
        path: '/favouritesreorder',
        name: 'favreorder',
        component: () => import('../pages/FavouritesReorder')
      },
      {
        path: '/help',
        name: 'help',
        component: () =>
          import(/* webpackChunkName: 'help' */ '../pages/Help.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../pages/Home.vue')
      },
      {
        path: '/journal',
        name: 'journal',
        component: () => import('../pages/Journal.vue')
      },
      {
        path: '/lots/:symbol',
        name: 'lots',
        component: () =>
          import(/* webpackChunkName: 'lots' */ '../pages/Lots.vue')
      },
      {
        path: '/payees',
        name: 'payees',
        component: () => import('../pages/Payees.vue')
      },
      {
        path: '/prices',
        name: 'prices',
        component: () =>
          import(/* webpackChunkName: 'prices' */ '../pages/Prices')
      },
      {
        path: '/reg/:name',
        name: 'register',
        component: () => import('../pages/Register.vue')
      },
      {
        path: '/reorder-postings',
        name: 'reorder postings',
        component: () => import(/* webpackChunkName: 'reorder-postings' */ '../pages/ReorderPostings.vue')
      },
      {
        path: '/restore/:type?',
        name: 'restore',
        component: () =>
          import(/* webpackChunkName: 'restore' */ '../pages/Restore.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../pages/Settings.vue')
      },
      {
        path: '/scheduledtransactions',
        name: 'scheduledtransactions',
        component: () =>
          import(
            /* webpackChunkName: 'scheduledtx' */ '../pages/ScheduledTxList.vue'
          )
      },
      {
        path: '/scheduledtxactions/:id',
        name: 'scheduledtxactions',
        props: true,
        component: () =>
          import(
            /* webpackChunkName: 'scheduledtx' */ '../pages/ScheduledTxActions.vue'
          )
      },
      {
        path: '/scheduledtxeditor/:id?',
        name: 'scheduledtxeditor',
        component: () =>
          import(
            /* webpackChunkName: 'scheduledtx' */ '../pages/ScheduledTxEditor.vue'
          )
      },
      {
        path: '/sync',
        name: 'sync',
        component: () => import('../pages/Sync.vue')
      },
      {
        path: '/tx/:id?',
        name: 'tx',
        component: () => import('../pages/Transaction.vue')
      },
      {
        path: '/tx-actions/:id',
        name: 'tx-actions',
        props: true,
        component: () => import('../pages/TransactionActions.vue')
      },
      {
        path: '/tx-search',
        name: 'tx-search',
        component: () =>
          import(/* webpackChunkName: 'txsearch' */ '../pages/TxSearch.vue')
      },
      {
        path: '/xact',
        name: 'xact',
        component: () =>
          import(/* webpackChunkName: 'xact' */ '../pages/Xact.vue')
      },
      {
        path: '/pcloud',
        name: 'pcloud',
        component: () =>
          import(/* webpackChunkName: 'pcloud' */ '../pages/Pcloud.vue')
      }
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
