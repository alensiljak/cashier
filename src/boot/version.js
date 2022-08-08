/*
    Set the application version
*/
import * as Vue from 'vue'
import { createApp } from 'vue'
import App from '../App.vue'

//Vue.prototype.$version = "v2022.07.19";

const app = createApp(App)
app.config.globalProperties.$version = "v2022.07.19"
