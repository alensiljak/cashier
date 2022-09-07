/**
  Notifications helper.
  Use:

const useNotification from 'CashierNotification'

const Notification = useNotifications()
// const { positive, neutral, negative } = useNotifications()

Notification.neutra('message')
 */

import { useQuasar } from 'quasar'

export default function useNotifications() {
  const $q = useQuasar()

  function negative(message) {
    $q.notify({ color: 'negative', message: message })
  }

  function neutral(message) {
    //
    $q.notify({ message: message })
  }

  function positive(message) {
    $q.notify({ color: 'positive', message: message })
  }

  return { negative, neutral, positive }
}
