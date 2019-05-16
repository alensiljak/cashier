/*
    Vue.js initialization file.
*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

// Font Awesome configuration and import.
import './faConfig.js';

// Bootstrap CSS.
import 'bootstrap-css-only/css/bootstrap.css'

// Quasar
import './quasarConfig'

Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   render: h => h(App)
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
