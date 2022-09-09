/*
  Cloud Backup functionality
*/

import { ref } from 'vue'
import { settings, SettingKeys } from './Configuration'
import usePcloud from './pCloudAdapter'
import moment from 'moment'

const isoTimestampFormat = 'YYYYMMDDHHmmss'

const { adapter } = usePcloud()

// methods

function getFilename(backupType) {
  // get the timestamp
  const now = moment()
  const timestamp = now.format(isoTimestampFormat)

  return `backup-${backupType}-${timestamp}.json`
}

/**
 * Handles backup and restore to/from the cloud.
 */
class CloudBackup {
  constructor() {}

  favourites = new FavouritesBackup()

  talk() {
    const timestamp = getFilename('yo')
    console.debug('hi!', timestamp)
  }
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

  async getRemoteBackupCount() {
    //
    await adapter.init()
    let result = await adapter.getFileCount()
    return result
  }
}

export default function useCloudBackup() {
  //

  function yo() {
    console.debug('yo!')
  }

  //const cloud = new CloudBackup()
  const favourites = new FavouritesBackup()

  return { yo, favourites }
}
