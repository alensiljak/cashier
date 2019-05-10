/*
    Vue.js initialization file.
*/
import Vue from 'vue'
import router from './router'
import App from './App.vue'

// Vuex
// import Vuex from 'vuex'
// Vue.use(Vuex)
import { store } from './store'

// Font Awesome configuration and import.
import './faConfig.js';

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

// https://stackoverflow.com/questions/32772581/how-to-integrate-vue-router-with-vue
//var App = Vue.extend({})
// router.start(App, '#app');