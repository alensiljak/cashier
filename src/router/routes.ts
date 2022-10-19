/*
  Routes
*/

// components
//const CalculatorNeu = () => import("../pages/Calculator.vue");

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/Qlayout.vue'),
    children: [
      { path: '', name: 'root', redirect: '/home' },
      {
        path: '/about',
        name: 'about',
        component: () => import('src/pages/About.vue'),
      },
      {
        path: '/account/:id',
        name: 'account',
        component: () =>
          import(/* webpackChunkName: 'account' */ 'src/pages/Account.vue'),
      },
      {
        path: '/accounts',
        name: 'accounts',
        component: () => import('src/pages/Accounts.vue'),
      },
      {
        path: '/assetallocation',
        name: 'assetallocation',
        component: () =>
          import(
            /* webpackChunkName: 'assetallocation' */ 'src/pages/AssetAllocation.vue'
          ),
      },
      {
        path: '/assetallocationhelp',
        name: 'assetallocationhelp',
        component: () =>
          import(
            /* webpackChunkName: 'assetallocation' */ 'src/pages/AssetAllocationHelp.vue'
          ),
      },
      {
        path: '/assetallocationsetuphelp',
        name: 'assetallocationsetuphelp',
        component: () =>
          import(
            /* webpackChunkName: 'assetallocation' */ 'src/pages/AASetupHelp.vue'
          ),
      },
      {
        path: '/assetclassdetail/:fullname?',
        name: 'assetclassdetail',
        component: () =>
          import(
            /* webpackChunkName: 'assetallocation' */ 'src/pages/AssetClassDetail.vue'
          ),
      },
      {
        path: '/bal',
        name: 'balanceSheet',
        component: () =>
          import(/* webpackChunkName: 'bal' */ 'src/pages/QBalanceSheet.vue'),
      },
      // {
      //   path: "/calculator",
      //   components: {
      //     default: CalculatorNeu,
      //   },
      // },
      {
        path: '/calendar',
        name: 'calendar',
        component: () =>
          import(/* webpackChunkName: 'calendar' */ 'src/pages/Calendar.vue'),
      },
      {
        path: '/cloudbackup',
        name: 'cloudbackup',
        component: () => import('src/pages/CloudBackup.vue'),
      },
      {
        path: '/commodities',
        name: 'commodities',
        component: () => import('src/pages/Commodities.vue'),
      },
      {
        path: '/demoData',
        name: 'demoData',
        component: () => import('src/pages/DemoData.vue'),
      },
      {
        path: '/export/:type?',
        name: 'export',
        component: () => import('src/pages/Export.vue'),
      },
      {
        path: '/favourites',
        name: 'favourites',
        component: () => import('src/pages/Favourites.vue'),
      },
      {
        path: '/favouritesreorder',
        name: 'favreorder',
        component: () => import('src/pages/FavouritesReorder.vue'),
      },
      {
        path: '/help',
        name: 'help',
        component: () =>
          import(/* webpackChunkName: 'help' */ 'src/pages/Help.vue'),
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('src/pages/Home.vue'),
      },
      {
        path: '/journal',
        name: 'journal',
        component: () => import('src/pages/Journal.vue'),
      },
      {
        path: '/lots/:symbol',
        name: 'lots',
        component: () =>
          import(/* webpackChunkName: 'lots' */ 'src/pages/Lots.vue'),
      },
      {
        path: '/payees',
        name: 'payees',
        component: () => import('src/pages/Payees.vue'),
      },
      {
        path: '/prices',
        name: 'prices',
        component: () =>
          import(/* webpackChunkName: 'prices' */ 'src/pages/Prices.vue'),
      },
      {
        path: '/reg/:name',
        name: 'register',
        component: () => import('src/pages/Register.vue'),
      },
      {
        path: '/reorder-postings',
        name: 'reorder postings',
        component: () =>
          import(
            /* webpackChunkName: 'reorder-postings' */ 'src/pages/ReorderPostings.vue'
          ),
      },
      {
        path: '/restore/:type?',
        name: 'restore',
        component: () =>
          import(/* webpackChunkName: 'restore' */ 'src/pages/Restore.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('src/pages/Settings.vue'),
      },
      {
        path: '/scheduledtransactions',
        name: 'scheduledtransactions',
        component: () =>
          import(
            /* webpackChunkName: 'scheduledtx' */ 'src/pages/ScheduledTxList.vue'
          ),
      },
      {
        path: '/scheduledtxactions/:id',
        name: 'scheduledtxactions',
        props: true,
        component: () =>
          import(
            /* webpackChunkName: 'scheduledtx' */ '../pages/ScheduledTxActions.vue'
          ),
      },
      {
        path: '/scheduledtxeditor/:id?',
        name: 'scheduledtxeditor',
        component: () =>
          import(
            /* webpackChunkName: 'scheduledtx' */ '../pages/ScheduledTxEditor.vue'
          ),
      },
      {
        path: '/sync',
        name: 'sync',
        component: () => import('../pages/Sync.vue'),
      },
      {
        path: '/tx/:id?',
        name: 'tx',
        component: () => import('../pages/Transaction.vue'),
      },
      {
        path: '/tx-actions/:id',
        name: 'tx-actions',
        props: true,
        component: () => import('src/pages/TransactionActions.vue'),
      },
      {
        path: '/tx-search',
        name: 'tx-search',
        component: () =>
          import(/* webpackChunkName: 'txsearch' */ 'src/pages/TxSearch.vue'),
      },
      {
        path: '/xact',
        name: 'xact',
        component: () =>
          import(/* webpackChunkName: 'xact' */ 'src/pages/Xact.vue'),
      },
    ],
  },
  // {
  //   // path: '/index.html',
  //   path: '*',
  //   redirect: '/'
  // },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/Error404.vue'),
  },
]

// Always leave this as last one
// routes.push({
//   path: '*',
//   component: () => import('pages/Error404.vue')
// })

export default routes
