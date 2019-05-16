/*
    Font Awesome configuration
    Ref: 
    https://stackoverflow.com/questions/41537212/use-font-awesome-in-a-vue-app-created-with-vue-cli-webpack
    https://github.com/FortAwesome/vue-fontawesome
    https://fontawesome.com/icons
*/
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faUser, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faBars, faUser, faTrash, faTrashAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
