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

  function custom(options: object) {
    $q.notify(options)
  }

  function error(message: string): void {
    $q.notify({ color: 'negative', message: message })
  }

  function info(message: string): void {
    $q.notify({ message, color: 'colour2', textColor: 'colour1' })
  }

  function neutral(message: string): void {
    //
    $q.notify({ message: message })
  }

  function warning(message: string): void {
    $q.notify({ color: 'accent', message: message })
  }

  function success(message: string): void {
    $q.notify({ color: 'positive', message: message })
  }

  return { custom, info, error, neutral, success }
}
