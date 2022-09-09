/*
  pCloud client as a composable component.
  https://github.com/pCloud/pcloud-sdk-js/
*/
import { ref } from 'vue'
//import pCloudSdk from 'pcloud-sdk-js'
import PcloudSdk from 'pcloud-sdk-js'
import { settings, SettingKeys } from './Configuration'
import appService from '../appService'
import PcloudClient from './pCloudClient'

const CLIENT_ID = 'swX3uGCh15u'

{
  // import pcloudSdk from 'pcloud-sdk-js'
  // // Create `client` using an oAuth token:
  // const client = pcloudSdk.createClient('access_token')
  // // then list root folder's contents:
  // client.listfolder(0).then((fileMetadata) => {
  //   console.log(fileMetadata)
  // })
}

class PcloudAdapter {
  token = null
  client = null

  constructor() {}

  async init() {
    // token
    if (!this.token) {
      let token = await loadToken()

      if (!token) {
        // todo: request authorization
        //token = await loginWithoutRedirect()
        token = await loginWithRedirect()
      }

      this.token = token
    }
    // client
    if (!this.client) {
      this.client = await PcloudSdk.createClient(this.token)
    }
  }

  async getFileCount() {
    let rootFolder = await this.client.listfolder(0)
    const fileCount = rootFolder.contents.length
    // .contents .name

    return fileCount
  }
}

async function loginWithRedirect() {
  console.debug('login with redirect')

  let result = new Promise(function (resolve, reject) {
    PcloudSdk.oauth.initOauthToken({
      client_id: CLIENT_ID,
      redirect_uri: 'http://127.0.0.1:8080/oauth.html',
      receiveToken: function (stuff) {
        console.debug('token received:', stuff)
        resolve(stuff)
      },
      onError: (err) => {
        console.log(err)
        reject(err)
      },
    })
  })
  return result
}

async function loginWithoutRedirect() {
  console.debug('login without redirect')

  var result = new Promise(function (resolve, reject) {
    console.debug('initiating poll token')

    PcloudSdk.oauth.initOauthPollToken({
      client_id: CLIENT_ID,
      receiveToken: function (token) {
        console.debug('received token:', token)

        resolve(token)
      },
      onError: (err) => {
        console.log(err)
        reject(err)
      },
    })
  })

  return result
}

async function loadToken() {
  // load access token
  const token = await settings.get(SettingKeys.pCloudToken)
  return token
}

async function upload(file, folderId) {
  //
  const client = await getClient()
  client.upload(file, folderId, {
    onBegin: () => {},
    onProgress: function (progress) {},
    onFinish: function (fileMetadata) {},
  })
}

export default function usePcloud() {
  // const locationid = 2
  let adapter = new PcloudAdapter()

  // loadToken()
  //   .then((token) => {
  //     adapter.token = token
  //     return createClient(token)
  //   })
  //   .then((client) => (adapter.client = client))
  //   .then((what) => console.debug(what))

  //adapter.init()

  return { adapter }
}
