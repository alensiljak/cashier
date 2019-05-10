/*
    Vue.js initialization file.
*/
import Vue from 'vue';
import router from './router'
import App from './App.vue';

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
