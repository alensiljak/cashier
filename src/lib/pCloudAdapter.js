/*
pCloud client as a composable component.
*/
import { ref } from 'vue'
import pCloudSdk from 'pcloud-sdk-js'
const CLIENT_ID = 'swX3uGCh15u'

// import pcloudSdk from 'pcloud-sdk-js'
// // Create `client` using an oAuth token:
// const client = pcloudSdk.createClient('access_token')
// // then list root folder's contents:
// client.listfolder(0).then((fileMetadata) => {
//   console.log(fileMetadata)
// })

export default function usePcloud() {
  // todo: load access token

  const x = ref(0)

  return { x }
}
