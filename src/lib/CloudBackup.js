// import appService from '../appService'
import { settings, SettingKeys } from './Configuration'
//import PcloudClient from './pCloudClient'
//import pCloudSdk from 'pcloud-sdk-js'

{
  // import pcloudSdk from 'pcloud-sdk-js'
  // // Create `client` using an oAuth token:
  // const client = pcloudSdk.createClient('access_token')
  // // then list root folder's contents:
  // client.listfolder(0).then((fileMetadata) => {
  //   console.log(fileMetadata)
  // })
}

/**
 * Handles backup and restore to/from the cloud.
 */
class CloudBackup {
  constructor() {}

  async backupFavourites() {
    let favs = new FavouritesBackup()
    await favs.backup()
  }

  /**
   * Finds the latest Favourites backup in the cloud.
   */
  getLastFavouritesMetadata() {}

  // private
}

class FavouritesBackup {
  async backup() {
    console.debug('backing up favourite accounts...')

    // read favourites
    let favArray = await settings.get(SettingKeys.favouriteAccounts)
    console.log(favArray)

    // prepare for upload

    // shoot
    //console.debug(PcloudClient)
  }
}

export default CloudBackup
