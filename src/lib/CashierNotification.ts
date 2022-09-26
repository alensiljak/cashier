/**
  Notifications helper.
  Use:

const useNotification from 'CashierNotification'

const Notification = useNotifications()
// or: const { positive, neutral, negative } = useNotifications()

Notification.neutral('message')
 */

import { useQuasar } from 'quasar'

export default function useNotifications() {
  const $q = useQuasar()

  function negative(message: string): void {
    $q.notify({ color: 'negative', message: message })
  }

  function info(message: string): void {
    $q.notify({ message, color: 'info' })
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

  return { info, negative, neutral, positive }
}
