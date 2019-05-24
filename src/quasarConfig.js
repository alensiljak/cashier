/**
 * Configuration and imports for Quasar framework
 */
import Vue from 'vue'

import './styles/quasar.styl'
//import lang from 'quasar/lang/en-gb.js'
//import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

import {
  Quasar,
  QLayout,
  QHeader,
  QToolbar,
  QBtn,
  QToolbarTitle,
  QPageContainer, QPage,
  QDrawer,
  QIcon,
  QList, QItem, QItemSection, QItemLabel,
  QScrollArea,
  QImg, QAvatar,
  Ripple,
  QPageSticky,
  QDate, QDialog, QInput, QPopupProxy, QField, date,
  Notify, ClosePopup,
  QTree, QExpansionItem,
  QSelect, QMenu, 
  QCard, QCardSection, QCardActions,
  QSpace, QSlideItem
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout, QHeader, QDrawer,
    QToolbar,
    QBtn,
    QToolbarTitle,
    QPageContainer,
    QPage,
    QIcon,
    QList, QItem, QItemSection, QItemLabel,
    QScrollArea,
    QImg, QAvatar,
    QPageSticky,
    QDate, QDialog, QInput, QPopupProxy, QField, date,
    QTree, QExpansionItem,
    QSelect, QMenu, 
    QCard, QCardSection, QCardActions,
    QSpace, QSlideItem
  },
  directives: {
    Ripple, ClosePopup
  },
  plugins: {
    Notify
  },
  // lang: lang,
  extras: [
    'fontawesome-v5',
  ]
})
