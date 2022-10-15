/*
  Cloud Backup functionality
*/

import { settings, SettingKeys } from './settings'
import usePcloud from './pCloudAdapter'
import moment from 'moment'

//const isoTimestampFormat = 'YYYYMMDDHHmmss'
const timestampFormat = 'YYYY-MM-DD-HHmmss'

const { adapter } = usePcloud()

interface FileInfo {
  name: string
  fileid: number
}

function getRegexFor(entityType: string): RegExp {
  //const template = `backup-${entityType}-[0-9]{14}.json`
  const template = `backup-${entityType}-[0-9-]{17}.json`
  const regex = new RegExp(template)
  //return template
  //.*?
  return regex
}

/**
 * Handles backup and restore to/from the cloud.
 */
class CloudBackup {
  // to be set by the inheriting classes
  entityTypeName = ''

  constructor() {}

  async backup(content: any) {
    const filename = this.getFilename()
    await adapter.upload(content, filename)
  }

  async download(filename: string) {
    return adapter.download('./' + filename)
  }

  getFilename() {
    // get the timestamp
    const now = moment()
    const timestamp = now.format(timestampFormat)

    return `backup-${this.entityTypeName}-${timestamp}.json`
  }

  async getLatestFile(): Promise<FileInfo> {
    // Get only the list of the files of the given type.
    const regex = getRegexFor(this.entityTypeName)

    const fileList = await adapter.getFileListFor(regex)

    // todo: get the latest, order by name
    let filenames = fileList.map((item) => item.name)
    filenames.sort()

    const lastIndex = filenames.length - 1
    let latestFilename = filenames[lastIndex]

    const latestFile = fileList.filter(
      (item) => item.name === latestFilename
    )[0]

    // todo: convert to a common interface?

    return latestFile as FileInfo
  }

  async getLatestFilename(): Promise<string> {
    const file = await this.getLatestFile()
    // console.log('latest file:', file)

    return file.name
  }

  async getRemoteBackupCount(): Promise<number> {
    //
    await adapter.init()
    let regex: RegExp = getRegexFor(this.entityTypeName)

    let result = await adapter.getFileCount(regex)
    return result
  }
}

class ScheduledTxBackup extends CloudBackup {
  entityTypeName = 'scheduled'
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

  const journal = new JournalBackup()
  const scheduledTxBackup = new ScheduledTxBackup()
  const settingsBackup = new SettingsBackup()

  return { yo, scheduledTxBackup, journal, settingsBackup }
}
