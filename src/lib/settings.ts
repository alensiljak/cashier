/*
    Various configuration-related things
*/
import db from '../store/indexedDb'
import { Setting } from '../model'

/**
 * Contains all the values required for the selection mode to function.
 * When an object of this type exists in the state store, we are in selection mode.
 */
export class SelectionModeMetadata {
  // The selection requestor. Can be used to explicitly name the origin and
  // avoid confusion in unexpected navigation routes.
  origin = ''

  postingIndex?: any

  // The type of item being selected. Useful on return to the original entity.
  selectionType?: string

  // The id of the selected item.
  selectedId: any
}

export const Constants = {
  CacheName: 'cashier',
}

export const SettingKeys = {
  assetAllocationDefinition: 'aa.definition',
  currency: 'currency',
  favouriteAccounts: 'favouriteAccounts',
  dbInitialized: 'dbInitialized', // Marks that the db has been initialized
  pCloudToken: 'pCloudToken',
  syncServerUrl: 'syncServerUrl',
  // path to the prices repository for CashierSync.
  pricesRepositoryPath: 'pricesRepositoryPath',
  // path to the book repository for CashierSync.
  repositoryPath: 'repositoryPath',
  rootInvestmentAccount: 'aa.rootAccount',
  rememberLastTransaction: 'rememberLastTransaction',
  writeableJournalFilePath: 'writeableJournalFilePath',
  // synchronization choices
  syncAccounts: 'syncAccounts',
  syncAaValues: 'syncAaValues',
  syncPayees: 'syncPayees',
}

class Settings {
  /**
   *
   * @param {any} key
   * @returns Promise with the Setting object
   */
  async get(key: any) {
    const setting = await db.settings.get(key)

    if (!setting) return null

    let value = null
    try {
      value = JSON.parse(setting.value)
    } catch (error) {
      value = setting.value
    }

    return value
  }

  async getAll() {
    return db.settings.toArray()
  }

  async set(key: string, value: any) {
    let jsonValue = JSON.stringify(value)
    let setting = new Setting(key, jsonValue)

    await db.settings.put(setting)
  }
}

let settings = new Settings()
export { settings }
