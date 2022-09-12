/*
  Cloud Backup functionality
*/

import { ref } from 'vue'
import { settings, SettingKeys } from './Configuration'
import usePcloud from './pCloudAdapter'
import moment from 'moment'

const isoTimestampFormat = 'YYYYMMDDHHmmss'

const { adapter } = usePcloud()

/**
 * Handles backup and restore to/from the cloud.
 */
class CloudBackup {
  // to be set by the inheriting classes
  entityTypeName = undefined

  constructor() {}

  async backup(content) {
    const filename = this.getFilename(this.entityTypeName)
    await adapter.upload(content, filename)
  }

  talk() {
    const timestamp = this.getFilename('yo')
    console.debug('hi!', timestamp)
  }

  getFilename(backupType) {
    // get the timestamp
    const now = moment()
    const timestamp = now.format(isoTimestampFormat)

    return `backup-${backupType}-${timestamp}.json`
  }

  async getRemoteBackupCount() {
    //
    await adapter.init()
    let result = await adapter.getFileCount(this.entityTypeName)
    return result
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
}

class JournalBackup extends CloudBackup {
  entityTypeName = 'journal'
}

class SettingsBackup extends CloudBackup {
  entityTypeName = 'settings'
}

export default function useCloudBackup() {
  //

  function yo() {
    console.debug('yo!')
  }

  //const cloud = new CloudBackup()
  const favourites = new FavouritesBackup()
  const journal = new JournalBackup()
  const settingsBackup = new SettingsBackup()

  return { yo, favourites, journal, settingsBackup }
}
