/*
  pCloud client as a composable component.
  https://github.com/pCloud/pcloud-sdk-js/
*/
import { ref } from 'vue'
import PcloudSdk from 'pcloud-sdk-js'
import { settings, SettingKeys } from './Configuration'
import appService from '../appService'
import PcloudClient from './pCloudClient'

const CLIENT_ID = 'swX3uGCh15u'
const FOLDER_ID = 0 // folder id is always 0 since we have only one folder.

{
  // import pcloudSdk from 'pcloud-sdk-js'
  // // Create `client` using an oAuth token:
  // const client = pcloudSdk.createClient('access_token')
  // // then list root folder's contents:
  // client.listfolder(0).then((fileMetadata) => {
  //   console.log(fileMetadata)
  // })
}

function getRegexFor(entityType) {
  const template = `backup-${entityType}-[0-9]{14}.json`
  const regex = new RegExp(template)
  //return template
  //.*?
  return regex
}

class PcloudAdapter {
  token = null
  client = null

  constructor() {}

  async init() {
    // token
    if (!this.token) {
      let token = await this.#loadToken()

      if (!token) {
        // request authorization
        token = await loginWithoutRedirect()
        // token = await loginWithRedirect()

        // Save token
        await settings.set(SettingKeys.pCloudToken, token)
      }

      this.token = token
    }
    // client
    if (!this.client) {
      this.client = await PcloudSdk.createClient(this.token)
    }
  }

  async getFileCount(entityType) {
    let rootFolder = await this.client.listfolder(FOLDER_ID)

    const filenames = rootFolder.contents.map((item) => item.name)

    // Get only the list of the files of the given type.
    const regex = getRegexFor(entityType)
    // console.log(regex)

    const fileCount = filenames.filter((name) => name.match(regex)).length

    // .contents .name

    return fileCount
  }

  async upload(content, filename) {
    if (!content || !filename) {
      throw new Error('No content or filename sent for upload!')
    }

    const file = new File([content], filename)
    const result = await this.client.upload(file, FOLDER_ID)

    // this.client.upload(file, FOLDER_ID, {
    //   onBegin: () => {},
    //   onProgress: function (progress) {},
    //   onFinish: function (fileMetadata) {},
    // })

    return result
  }

  async #loadToken() {
    // load access token
    const token = await settings.get(SettingKeys.pCloudToken)
    return token
  }
}

async function loginWithRedirect() {
  console.debug('login with redirect')

  let result = new Promise((resolve, reject) => {
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

/**
 * Login directly and get the token.
 * @returns authentication token
 */
async function loginWithoutRedirect() {
  // console.debug('login without redirect')

  var result = new Promise((resolve, reject) => {
    PcloudSdk.oauth.initOauthPollToken({
      client_id: CLIENT_ID,
      receiveToken: function (token) {
        //console.debug('received token:', token)

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

export default function usePcloud() {
  window.locationid = 2

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
