/**
 * The service which handles the Accounts data.
 * It should simply use the cached versions of API requests,
 * and parse them when needed.
 * No other local storage is used.
 */
import { SettingKeys, settings, Constants } from './Configuration';
import { CashierSync } from './syncCashier';

export class AccountService {
  constructor() {}
  async getAccountsFromCache() {
    // This version simply retrieves the cached version of /accounts response.
    const serverUrl = await settings.get(SettingKeys.syncServerUrl)
    const cashierSync = new CashierSync(serverUrl)
    const cache = await caches.open(Constants.CacheName)
    const accountsResponse = await cache.match(cashierSync.accountsUrl)
    const accounts = await accountsResponse.json()
    // they should be already sorted by name.
    console.debug(accounts)
  }
}
