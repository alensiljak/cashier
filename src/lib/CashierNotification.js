import { useQuasar } from 'quasar'

const $q = useQuasar()

class CashierNotification {
  negative() {
    $q.notify({ color: 'secondary', message: reason.message })
  }

  neutral() {
    //
  }

  positive() {
    console.log('positive')
  }
}
