/*
  Cloud Backup functionality
*/

import { ref } from 'vue'
// import appService from '../appService'
import { settings, SettingKeys } from './Configuration'
//import pCloudSdk from 'pcloud-sdk-js'
import usePcloud from './pCloudAdapter'
import moment from 'moment'

const isoTimestampFormat = 'YYYYMMDDHHmmss'

/**
 * Handles backup and restore to/from the cloud.
 */
class CloudBackup {
  constructor() {}

  favourites = new FavouritesBackup()

  talk() {
    const timestamp = this.#getFilename('yo')
    console.debug('hi!', timestamp)
  }

  async backupFavourites() {
    let favs = new FavouritesBackup()
    await favs.backup()
  }

  #getFilename(backupType) {
    // get the timestamp
    const now = moment()
    const timestamp = now.format(isoTimestampFormat)

    return `backup-${backupType}-${timestamp}.json`
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

  async fetchRemoteBackups() {}
}

export default function useCloudBackup() {
  //
  const adapter = usePcloud()

  const state = ref(3)

  function yo() {
    console.debug('yo!')
  }

  const cloud = new CloudBackup()

  //return { yo, state, cloud }
  return cloud
}
