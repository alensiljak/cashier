/*
    Various configuration-related things
*/
import db from "../dataStore";
import { Setting } from "../model";

/**
 * Contains all the values required for the selection mode to function.
 * When an object of this type exists in the state store, we are in selection mode.
 */
export class SelectionModeMetadata {
  constructor() {
    // The selection requestor. Can be used to explicitly name the origin and
    // avoid confusion in unexpected navigation routes.
    this.origin = "";
    // The type of item being selected. Useful on return to the original entity.
    this.selectionType = null;
    // The id of the selected item.
    this.selectedId = null;
  }
}

export const Constants = {
  CacheName: 'cashier'
}

export const SettingKeys = {
  assetAllocationDefinition: "aa.definition",
  currency: "currency",
  favouriteAccounts: "favouriteAccounts",
  pCloudToken: 'pCloudToken',
  syncServerUrl: "syncServerUrl",
  // path to the prices repository for CashierSync.
  pricesRepositoryPath: "pricesRepositoryPath",
  // path to the book repository for CashierSync.
  repositoryPath: "repositoryPath",
  rootInvestmentAccount: "aa.rootAccount",
  rememberLastTransaction: "rememberLastTransaction",
  writeableJournalFilePath: "writeableJournalFilePath"
};

class Settings {
  /**
   *
   * @param {any} key
   * @returns Promise with the Setting object
   */
  async get(key) {
    const setting = await db.settings.get(key);

    if (!setting) return null;

    let value = null;
    try {
      value = JSON.parse(setting.value);
    } catch (e) {
      value = setting.value;
    }

    return value;
  }

  async set(key, value) {
    let jsonValue = JSON.stringify(value);
    let setting = new Setting(key, jsonValue);

    await db.settings.put(setting);
  }
}

let settings = new Settings();
export { settings };
