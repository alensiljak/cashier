/*
    Initialize font awesome
*/
import { library } from '@fortawesome/fontawesome-svg-core'
// icon
import { faStar } from '@fortawesome/free-solid-svg-icons'

library.add(faStar)

import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)

// const camera = icon({ prefix: 'fas', iconName: 'camera' })
// export { camera }
