import { register } from 'register-service-worker'
import { Notify } from 'quasar'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready () {
    //if (process.env.DEV) {
      console.log('App is being served from cache by a service worker.')
    //}
  },

  registered (/* registration */) {
    //if (process.env.DEV) {
      console.log('Service worker has been registered.')
    //}
  },

  cached (/* registration */) {
    //if (process.env.DEV) {
      console.log('Content has been cached for offline use.')
    //}
  },

  updatefound (/* registration */) {
    //if (process.env.DEV) {
      console.log('New content is downloading.')
    //}
  },

  updated (/* registration */) {
    //if (process.env.DEV) {
      console.log('New content is available; please refresh.')

      //window.location.reload(true)

      Notify.create({
        //message: i18n.t('messages.update_available'),
        message: 'App update available, click below to update now.',
        color: 'positive',
        icon: 'cloud_download',
        //closeBtn: i18n.t('labels.update'),
        closeBtn: 'Update',
        timeout: 10000,
        onDismiss () {
          window.location.reload(true)
        }
      })
    //}
  },

  offline () {
    //if (process.env.DEV) {
      console.log('No internet connection found. App is running in offline mode.')
    //}
  },

  error (err) {
    //if (process.env.DEV) {
      console.error('Error during service worker registration:', err)
    //}
  }
})
