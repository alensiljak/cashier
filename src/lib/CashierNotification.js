/**
 * Notifications helper.
 * Use:
 *     const useNotification from 'CashierNotification'
 *
 */

import { useQuasar } from 'quasar'

let $q = null

class Notification {
  constructor(quasar) {
    $q = quasar
  }
  negative(message) {
    $q.notify({ color: 'negative', message: message })
  }

  neutral(message) {
    //
    $q.notify({ message: message })
  }

  positive(message) {
    $q.notify({ color: 'positive', message: message })
  }
}
// export default { negative, neutral, positive }
// defineExpose({ negative, neutral, positive })

export default function useNotifications(quasar) {
  const $q = useQuasar()

  return new Notification($q)
}
