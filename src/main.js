/*
    Vue.js initialization file.
*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stateStore'
import './registerServiceWorker'
import './persistentStorage'

// Font Awesome configuration and import.
// import './faConfig.js';

// Bootstrap CSS.
// import 'bootstrap-css-only/css/bootstrap.css'

// Quasar
import './quasarConfig'
import './fontAwesome'

Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   render: h => h(App)
// });

Vue.prototype.$version = "v2019.06.02-2"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
