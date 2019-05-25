/*
    Initialize font awesome
*/
import { library } from '@fortawesome/fontawesome-svg-core'
// icon
import { faBalanceScale, faInfo, faListUl, faLuggageCart, faMoneyBillWave, 
    faPlus, faPlusCircle,
    faSearch, faSignInAlt, faSignOutAlt, 
    faStar, faSyncAlt, faTrashAlt, faUsers, faWallet } 
    from '@fortawesome/free-solid-svg-icons'
// import { faRegular } from '@fortawesome/free-regular-svg-icons'

library.add(faBalanceScale, faInfo, faListUl, faLuggageCart, faMoneyBillWave, 
    faPlus, faPlusCircle,
    faSearch, faSignInAlt, faSignOutAlt, 
    faStar, faSyncAlt, faTrashAlt, faUsers, faWallet)

import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)

// const camera = icon({ prefix: 'fas', iconName: 'camera' })
// export { camera }
