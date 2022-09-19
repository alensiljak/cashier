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

  function negative(message: string): void {
    $q.notify({ color: 'negative', message: message })
  }

  function neutral(message: string): void {
    //
    $q.notify({ message: message })
  }

  function warning(message: string): void {
    $q.notify({ color: 'accent', message: message })
  }

  function positive(message: string): void {
    $q.notify({ color: 'positive', message: message })
  }

  return { negative, neutral, positive }
}
