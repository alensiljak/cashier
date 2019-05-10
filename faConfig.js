/*
    Font Awesome configuration
    Ref: https://stackoverflow.com/questions/41537212/use-font-awesome-in-a-vue-app-created-with-vue-cli-webpack
*/
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
// import { faRegular } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faUser, faTrash, faTrashAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
