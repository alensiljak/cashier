/*
    Initialize font awesome
*/
import { library } from "@fortawesome/fontawesome-svg-core";
// icon
import {
  faBalanceScale,
  faBarcode,
  faBoxes,
  faBriefcase,
  faBusinessTime,
  faCalendarAlt,
  faCalendarDay,
  faCheck,
  faCodeBranch,
  faCog,
  faDatabase,
  faDownload,
  faExchangeAlt,
  faFileAlt,
  faFolder,
  faForward,
  faHome,
  faInfo,
  faListUl,
  faLuggageCart,
  faMoneyBillWave,
  faPlus,
  faPlusCircle,
  faQuestionCircle,
  faSave,
  faScroll,
  faSearch,
  faSearchDollar,
  faSignInAlt,
  faSignOutAlt,
  faSkull,
  faStar,
  faSyncAlt,
  faShareAlt,
  faSort,
  faTimesCircle,
  faTrashAlt,
  faUpload,
  faUser,
  faUsers,
  faWallet
} from "@fortawesome/free-solid-svg-icons";
// import { faRegular } from '@fortawesome/free-regular-svg-icons'

library.add(
  faBalanceScale,
  faBarcode,
  faBoxes,
  faBriefcase,
  faBusinessTime,
  faCalendarAlt,
  faCalendarDay,
  faCheck,
  faCodeBranch,
  faCog,
  faDatabase,
  faDownload,
  faExchangeAlt,
  faFileAlt,
  faFolder,
  faForward,
  faHome,
  faInfo,
  faListUl,
  faLuggageCart,
  faMoneyBillWave,
  faPlus,
  faPlusCircle,
  faQuestionCircle,
  faSave,
  faScroll,
  faSearch,
  faSearchDollar,
  faSignInAlt,
  faSignOutAlt,
  faSkull,
  faStar,
  faSyncAlt,
  faShareAlt,
  faSort,
  faTimesCircle,
  faTrashAlt,
  faUpload,
  faUser,
  faUsers,
  faWallet
);

import Vue from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

// const camera = icon({ prefix: 'fas', iconName: 'camera' })
// export { camera }
