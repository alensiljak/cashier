/*
  deprecated now!
  See https://quasar.dev/quasar-cli/boot-files#Introduction
  
    Vue.js initialization file.
    Used from vue-cli.
*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stateStore'
import './registerServiceWorker'
import './persistentStorage'

// Quasar
import './quasarConfig'

Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   render: h => h(App)
// });

//new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

createApp(App).use(store).use(router).mount('#app')
