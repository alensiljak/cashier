/*
    Vue.js initialization file.
*/
import Vue from 'vue';
import router from './router'
import App from './App.vue';

// Vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// Font Awesome configuration and import.
import './faConfig.js';

Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   render: h => h(App)
// });

new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
