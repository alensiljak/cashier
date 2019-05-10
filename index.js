/*
    Vue.js initialization file.
*/
import Vue from 'vue';
import router from './router'
import App from './App.vue';

// Font Awesome
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faSolid } from '@fortawesome/free-solid-svg-icons'
//import { faRegular } from '@fortawesome/free-regular-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//library.add(faSolid)
// library.add(faRegular)
// Vue.component('font-awesome-icon', FontAwesomeIcon)
// end Font Awesome

Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   render: h => h(App)
// });

new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
