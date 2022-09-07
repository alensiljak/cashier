/*
pCloud client as a composable component
*/
import { ref } from 'vue'
import pCloudSdk from 'pcloud-sdk-js'
const CLIENT_ID = 'swX3uGCh15u'

export default function usePcloud() {
  const x = ref(0)

  return { x }
}
