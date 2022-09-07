import { useQuasar } from 'quasar'

const $q = useQuasar()

console.debug('when is this executed, if ever?', $q)

const negative = () => {
  console.debug('negative')

  $q.notify({ color: 'secondary', message: reason.message })
}

function neutral() {
  //
  console.debug('neutral')
}

function positive() {
  console.log('positive')
}

// export default { negative, neutral, positive }
// defineExpose({ negative, neutral, positive })

export default function useNotifications() {
  return { negative, neutral, positive }
}
